import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { AuctionSessionInformation } from 'src/entities/auction-session-information.entity';
import { AuctionSession } from 'src/entities/auction-session.entity';
import { Balence } from 'src/entities/balence.entity';
import { Bid } from 'src/entities/bid.entity';
import { Product } from 'src/entities/product.entity';
import { User } from 'src/entities/user.entity';
import { BadRequestExceptionCustom } from 'src/exceptions/bad-request.exception ';
import { paginateResponse } from 'src/utils/paginationUtils';
import { Connection, EntityManager, getRepository } from 'typeorm';
import {
  CloseAuctionSessionInput,
  CreateAuctionInput,
  GetListAuctionsInput,
  PlaceBidInput,
} from './dto/auction.input';

@Injectable()
export class AuctionService {
  constructor(
    private connection: Connection,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  /**
   * find one unions
   * @param id
   * @returns
   */
  async createAuctionSession(
    data: CreateAuctionInput,
    userId: number,
  ): Promise<AuctionSession> {
    try {
      let response;
      await this.connection.transaction(async (manager: EntityManager) => {
        const { timeEnd, reservePrice, productId } = data;

        const seller = await manager.findOne(User, userId);
        if (!seller) {
          throw new BadRequestExceptionCustom('Permission denied. Try again.');
        }

        const newSessionInformation = manager.create(
          AuctionSessionInformation,
          {
            timeEnd,
            reservePrice,
          },
        );

        const resultCreateSessionInfo = await manager.save(
          newSessionInformation,
        );

        const product = await manager.findOne(Product, productId);
        if (!product || Number(product?.owner) !== Number(userId)) {
          throw new BadRequestExceptionCustom(
            'Your image not found. Try again.',
          );
        }

        const newAuctionSession = manager.create(AuctionSession, {
          sessionInformation: resultCreateSessionInfo,
          product,
          seller,
        });

        response = await manager.save(newAuctionSession);
        await this.scheduleCloseAuctionSession({
          timeEnd: newAuctionSession?.sessionInformation?.timeEnd,
          auctionSessionId: response?.id,
        });
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * find one unions
   * @param id
   * @returns
   */
  async placeBid(data: PlaceBidInput, userId: number): Promise<Bid> {
    try {
      let response;
      await this.connection.transaction(async (manager: EntityManager) => {
        const { auctionSessionId, bidPrice } = data;

        const currentUser = await manager.findOne(User, userId);
        if (!currentUser) {
          throw new BadRequestExceptionCustom(
            'Failed to place a bid. Try again.',
          );
        }

        const auctionSession = await manager.findOne(
          AuctionSession,
          auctionSessionId,
          { relations: ['sessionInformation'] },
        );
        if (!auctionSession) {
          throw new BadRequestExceptionCustom(
            'Failed to place a bid. Try again.',
          );
        } else if (
          bidPrice <= auctionSession?.sessionInformation?.reservePrice
        ) {
          throw new BadRequestExceptionCustom(
            'Your price must larger the reserve price. Try again.',
          );
        } else if (auctionSession.isFinished) {
          throw new BadRequestExceptionCustom('Auction has closed.');
        }

        const newBid = manager.create(Bid, {
          bidPrice,
          bidBy: currentUser,
          auctionSession,
        });

        response = await manager.save(newBid);

        const { sessionInformation } = auctionSession;
        if (
          !sessionInformation.largestBid ||
          Number(response?.bidPrice) >
            Number(sessionInformation?.largestBid?.bidPrice)
        ) {
          await manager
            .getRepository(AuctionSessionInformation)
            .update(sessionInformation?.id, { largestBid: response });
        }

        const currentUserBalence = await manager.findOne(Balence, {
          where: {
            userId,
          },
        });

        if (!currentUserBalence || currentUserBalence.amount <= 0) {
          throw new BadRequestExceptionCustom('Please connect your wallet.');
        }

        const oldAmount = currentUserBalence?.amount;
        if (Number(oldAmount) < Number(bidPrice)) {
          throw new BadRequestExceptionCustom('Your balence not enough.');
        }

        currentUserBalence.amount = Number(oldAmount) - Number(bidPrice);
        await manager.save(currentUserBalence);
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async scheduleCloseAuctionSession(data: CloseAuctionSessionInput) {
    const { auctionSessionId, timeEnd } = data;
    const date = new Date(timeEnd);

    const job = new CronJob(date, () => {
      this.closeAuctionSession(data);
    });
    console.log('scheduleCloseAuctionSession=============', job);

    this.schedulerRegistry.addCronJob(`${date}_${auctionSessionId}`, job);
    job.start();
  }

  async closeAuctionSession(data: CloseAuctionSessionInput) {
    const { auctionSessionId, timeEnd } = data;
    const date = new Date(timeEnd);
    try {
      await this.connection.transaction(async (manager: EntityManager) => {
        const auctionSession = await manager.findOne(
          AuctionSession,
          auctionSessionId,
          {
            relations: [
              'sessionInformation',
              'product',
              'sessionInformation.largestBid',
              'sessionInformation.largestBid.bidBy',
            ],
          },
        );
        if (!auctionSession) {
          return;
        }
        auctionSession.isFinished = true;

        const product = await manager.findOne(
          Product,
          auctionSession?.product?.id,
        );
        if (!product) {
          return;
        }
        const largestBid = auctionSession?.sessionInformation?.largestBid;
        if (largestBid) {
          product.owner = largestBid?.bidBy?.id;
          await manager.save(product);
          auctionSession.isSold = true;
        }
        await manager.save(auctionSession);

        this.schedulerRegistry.deleteCronJob(`${date}_${auctionSessionId}`);

        const listBidRefund = await getRepository(Bid)
          .createQueryBuilder('bid')
          .leftJoinAndSelect('bid.auctionSession', 'auctionSession')
          .leftJoinAndSelect('bid.bidBy', 'bidBy')
          .where('auctionSession.id = :auctionSessionId', { auctionSessionId })
          .andWhere('bid.id != :largestBidId', { largestBidId: largestBid?.id })
          .getMany();

        const listObjUserRefund = {};
        listBidRefund.forEach((bidItem: Bid) => {
          if (!listObjUserRefund[bidItem?.bidBy?.id]) {
            listObjUserRefund[bidItem?.bidBy?.id] = Number(bidItem?.bidPrice);
          } else {
            listObjUserRefund[bidItem?.bidBy?.id] =
              Number(bidItem?.bidPrice) + listObjUserRefund[bidItem?.bidBy?.id];
          }
        });

        const listPromise = Object.keys(listObjUserRefund).map(
          async (userIdItem: string) => {
            const userBalence = await manager.findOne(Balence, {
              where: {
                userId: Number(userIdItem),
              },
            });
            if (!userBalence) return;
            userBalence.amount =
              Number(userBalence.amount) +
              Number(listObjUserRefund[userIdItem]);
            return manager.save(userBalence);
          },
        );

        await Promise.all(listPromise);
      });
    } catch (error) {
      throw error;
    }
  }

  async viewAuctionSession(auctionSessionId: number, currentUser: number) {
    try {
      await this.connection.transaction(async (manager: EntityManager) => {
        const auctionSession = await manager.findOne(
          AuctionSession,
          auctionSessionId,
          { relations: ['sessionInformation', 'seller'] },
        );

        if (
          !auctionSession ||
          Number(auctionSession?.seller?.id) === Number(currentUser)
        ) {
          return;
        }

        await manager.update(
          AuctionSessionInformation,
          auctionSession?.sessionInformation?.id,
          { rating: () => 'rating + 1' },
        );
      });
    } catch (error) {
      throw error;
    }
  }

  async getListAuction(input: GetListAuctionsInput) {
    try {
      let response;
      await this.connection.transaction(async () => {
        const { limit = 10, page = 1 } = input;

        const take = limit;
        const skip = (page - 1) * limit;

        const data = await getRepository(AuctionSession)
          .createQueryBuilder('auctionSession')
          .leftJoinAndSelect(
            'auctionSession.sessionInformation',
            'sessionInformation',
          )
          .leftJoinAndSelect('auctionSession.seller', 'seller')
          .leftJoinAndSelect('seller.userInformation', 'userInformation')
          .leftJoinAndSelect('auctionSession.product', 'product')
          .leftJoinAndSelect('product.tags', 'tags')
          .orderBy('sessionInformation.rating', 'DESC')
          .addOrderBy('auctionSession.createdAt', 'DESC')
          .where('sessionInformation.timeEnd > :now', {now: new Date().toISOString()})
          .take(take)
          .skip(skip)
          .getManyAndCount();
        response = paginateResponse(data, { page, limit: take });
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
}
