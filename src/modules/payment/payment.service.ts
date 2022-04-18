import { Injectable } from '@nestjs/common';
import { Balence } from 'src/entities/balence.entity';
import { User } from 'src/entities/user.entity';
import { BadRequestExceptionCustom } from 'src/exceptions/bad-request.exception ';
import { ConflictExceptionCustom } from 'src/exceptions/conflict.exception ';
import { Connection, EntityManager } from 'typeorm';
import { PayInput, UpdateBalenceInput } from './dto/payment.input';

@Injectable()
export class PaymentService {
  constructor(
    private connection: Connection,
  ) {}
  /**
   * find one unions
   * @param id
   * @returns
   */
  async updateBalence(
    data: UpdateBalenceInput,
    userId: number,
  ): Promise<Balence> {
    try {
      const { cardNumber, amount } = data;
      let result;
      await this.connection.transaction(async (manager: EntityManager) => {
        if (!amount) {
          throw new BadRequestExceptionCustom('Failed. Try again.');
        }

        const currentUser = await manager.findOne(User, userId);

        if (!currentUser) {
          throw new ConflictExceptionCustom('Account not exist');
        }

        let currentBalenceUserToUpdate = new Balence();
        const currentBalenceUser = await manager.findOne(Balence, {
          where: {
            userId,
          },
        });

        if (currentBalenceUser) {
          currentBalenceUserToUpdate = currentBalenceUser;
          const oldAmount = currentBalenceUser.amount;
          currentBalenceUserToUpdate.amount = Number(amount) + Number(oldAmount);
        } else {
          currentBalenceUserToUpdate.amount = Number(amount);
          currentBalenceUserToUpdate.userId = userId;
        }

        if (cardNumber) {
          currentBalenceUserToUpdate.cardNumber = cardNumber;
        }
        
        result = await manager.save(currentBalenceUserToUpdate);
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

    /**
   * find one unions
   * @param data
   * @returns
   */
    async handlePay(
      data: PayInput,
      userId: number,
    ): Promise<Balence> {
      try {
        const { price } = data;
        let response;
        await this.connection.transaction(async (manager: EntityManager) => {
          const currentUser = await manager.findOne(User, userId);
  
          if (!currentUser) {
            throw new ConflictExceptionCustom('Account not exist.');
          }
          
          const currentBalenceUser = await manager.findOne(Balence, {
            where: {
              userId
            }
          })

          if (!currentBalenceUser) {
            throw new ConflictExceptionCustom('Failed to pay. Try again.');
          }
          const oldAmount = currentBalenceUser.amount;
          currentBalenceUser.amount = Number(oldAmount) - Number(price);
          response = await manager.save(currentBalenceUser);
        });
        return response;
      } catch (error) {
        throw error;
      }
    }

}
