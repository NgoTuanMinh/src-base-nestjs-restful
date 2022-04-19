import { Injectable } from '@nestjs/common';
import { AuctionSessionInformation } from 'src/entities/auction-session-information.entity';
import { AuctionSession } from 'src/entities/auction-session.entity';
import { Bid } from 'src/entities/bid.entity';
import { Product } from 'src/entities/product.entity';
import { User } from 'src/entities/user.entity';
import { BadRequestExceptionCustom } from 'src/exceptions/bad-request.exception ';
import { Connection, EntityManager } from 'typeorm';
import { CreateAuctionInput, PlaceBidInput } from './dto/auction.input';
@Injectable()
export class AuctionService {
  constructor(
    private connection: Connection,
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

        const newSessionInformation = manager.create(AuctionSessionInformation, {
          timeEnd,
          reservePrice,
        })

        const resultCreateSessionInfo = await manager.save(newSessionInformation);
        
        const product = await manager.findOne(Product, productId);
        if (!product) {
          throw new BadRequestExceptionCustom('Create failed. Try again.');
        }

        const newAuctionSession = manager.create(AuctionSession, {
          sessionInformation: resultCreateSessionInfo,
          product,
          seller,
        });

        response = await manager.save(newAuctionSession); 
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
   async placeBid(
    data: PlaceBidInput,
    userId: number,
  ): Promise<Bid> {
    try {
      let response;
      await this.connection.transaction(async (manager: EntityManager) => {
        const { auctionSessionId, bidPrice } = data;

        const currentUser = await manager.findOne(User, userId);
        if (!currentUser) {
          throw new BadRequestExceptionCustom('Failed to place a bid. Try again.');
        }

        const auctionSession = await manager.findOne(AuctionSession, auctionSessionId, {relations: ['sessionInformation']});
        if (!auctionSession) {
          throw new BadRequestExceptionCustom('Failed to place a bid. Try again.');
        } else if (bidPrice <= auctionSession?.sessionInformation?.reservePrice) {
          throw new BadRequestExceptionCustom('Your price must larger the reserve price. Try again.');
        }

        const newBid = manager.create(Bid, {
          bidPrice,
          bidBy: currentUser,
          auctionSession,
        })

        const resultCreate = await manager.save(newBid);

        response = await manager.save(resultCreate); 
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
}
