import { Injectable } from '@nestjs/common';
import { Follow } from 'src/entities/follow.entity';
import { UserInformation } from 'src/entities/user-information.entity';
import { UserSocialNetwork } from 'src/entities/user-social-network.entity';
import { User } from 'src/entities/user.entity';
import { BadRequestExceptionCustom } from 'src/exceptions/bad-request.exception ';
import { ConflictExceptionCustom } from 'src/exceptions/conflict.exception ';
import {
  paginateResponse,
  PaginationOptions,
  PayloadResponse,
} from 'src/utils/paginationUtils';
import { Connection, EntityManager } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import {
  QueryUserInput,
  UpdateUserInfoInput,
  UpdateUserSocialNetwork,
} from './dto/user.input';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    public repository: UserRepository,
    private connection: Connection,
  ) {}

  /**
   * find one unions
   * @param id
   * @returns
   */
  async findAll(): Promise<Array<User>> {
    const list = await this.repository.find();
    return list;
  }

  /**
   * find one unions
   * @param id
   * @returns
   */
  async create(data: CreateUserInput): Promise<User> {
    try {
      const { userName, password } = data;
      let result = new User();
      await this.connection.transaction(async (manager: EntityManager) => {
        const accoutExist = await this.repository.findOne({
          where: { userName },
        });

        if (accoutExist) {
          throw new ConflictExceptionCustom('Account exist');
        }
        const newUser = manager.create(User, {
          userName,
          password,
        });
        const resultCreate = await manager.save(newUser);
        result = resultCreate;
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * find one unions
   * @param id
   * @returns
   */
  async updateUserInfo(
    data: UpdateUserInfoInput,
    userId: number,
  ): Promise<UserInformation> {
    try {
      const { profileImage, bio, displayName, email, phoneNumber } = data;
      let result;
      await this.connection.transaction(async (manager: EntityManager) => {
        const currentUser = await this.repository.findOne({
          where: { id: userId },
          relations: ['userInformation'],
        });

        if (!currentUser) {
          throw new ConflictExceptionCustom('Account not exist');
        }

        let currentUserInfoToUpdate = new UserInformation();
        const currentUserInfo = await manager.findOne(UserInformation, {
          where: {
            userId: currentUser?.id,
          },
        });

        if (currentUserInfo) {
          currentUserInfoToUpdate = currentUserInfo;
        }

        if (bio) {
          currentUserInfoToUpdate.bio = bio;
        }
        if (profileImage) {
          currentUserInfoToUpdate.profileImage = profileImage;
        }
        if (displayName) {
          currentUserInfoToUpdate.displayName = displayName;
        }
        if (email) {
          currentUserInfoToUpdate.email = email;
        }
        if (phoneNumber) {
          currentUserInfoToUpdate.phoneNumber = phoneNumber;
        }
        currentUserInfoToUpdate.userId = userId;
        currentUser.userInformation = currentUserInfoToUpdate;
        await manager.save(currentUser);
        result = await manager.save(currentUserInfoToUpdate);
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * find one unions
   * @param id
   * @returns
   */
  async updateUserSocialNetwork(
    data: UpdateUserSocialNetwork[],
    userId: number,
  ): Promise<any> {
    try {
      if (data.length === 0) return;
      const listItem = data.map((item: UpdateUserSocialNetwork) => ({
        userId,
        displayNameSocial: item?.displayNameSocial,
        linkSocialNetwork: item?.linkSocialNetwork,
        type: item?.type,
      }));
      let success = false;
      await this.connection.transaction(async (manager: EntityManager) => {
        const listPromise = listItem.map(
          async (itemUpdate: UpdateUserSocialNetwork) => {
            const userSocialNetworkDb = await manager.findOne(
              UserSocialNetwork,
              {
                where: {
                  type: itemUpdate?.type,
                  userId: userId,
                },
              },
            );
            if (userSocialNetworkDb) {
              (userSocialNetworkDb.linkSocialNetwork =
                itemUpdate?.linkSocialNetwork),
                (userSocialNetworkDb.displayNameSocial =
                  itemUpdate?.displayNameSocial),
                await manager.save(userSocialNetworkDb);
              return userSocialNetworkDb;
            } else {
              const newUserSocialNetwork = manager.create(UserSocialNetwork, {
                type: itemUpdate?.type,
                linkSocialNetwork: itemUpdate?.linkSocialNetwork,
                displayNameSocial: itemUpdate?.displayNameSocial,
                userId,
              });
              const resultCreate = await manager.save(newUserSocialNetwork);
              return resultCreate;
            }
          },
        );
        await Promise.all(listPromise);
        success = true;
      });
      return success;
    } catch (error) {
      throw error;
    }
  }

  /**
   * find one unions
   * @param id
   * @returns
   */
  async handleFolow(userIsFollowed: number, userId: number): Promise<any> {
    try {
      if (!userIsFollowed) return;
      let response: Follow;
      await this.connection.transaction(async (manager: EntityManager) => {
        const followQuery = await manager.findOne(Follow, {
          where: {
            userFollow: userId,
            userIsFollowed,
          },
        });

        if (followQuery) {
          throw new BadRequestExceptionCustom('This user is followed');
        }

        const checkUserIsFolled = await manager.findOne(User, {
          where: {
            id: userIsFollowed,
          },
        });

        if (!checkUserIsFolled) {
          throw new BadRequestExceptionCustom(
            'Failed to follow. Try again later.',
          );
        }

        const newFollow = manager.create(Follow, {
          userFollow: userId,
          userIsFollowed,
        });

        response = await manager.save(newFollow);
        if (!response) {
          throw new BadRequestExceptionCustom(
            'Failed to follow. Try again later.',
          );
        }
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
  async handleUnFolow(userIsFollowed: number, userId: number): Promise<any> {
    try {
      if (!userIsFollowed) return;
      let success = false;
      await this.connection.transaction(async (manager: EntityManager) => {
        const followQuery = await manager.findOne(Follow, {
          where: {
            userFollow: userId,
            userIsFollowed,
          },
        });

        if (!followQuery) {
          throw new BadRequestExceptionCustom(
            'Failed to unfollow. Try again later.',
          );
        }

        const checkUserIsFolled = await manager.findOne(User, {
          where: {
            id: userIsFollowed,
          },
        });

        if (!checkUserIsFolled) {
          throw new BadRequestExceptionCustom(
            'Failed to follow. Try again later.',
          );
        }

        await manager.remove(followQuery);
        success = true;
        return success;
      });
      return success;
    } catch (error) {
      throw error;
    }
  }

  /**
   * find one unions
   * @param id
   * @returns
   */
  async getFollowing(
    userId: number,
    options: PaginationOptions,
  ): Promise<PayloadResponse> {
    try {
      let response: PayloadResponse;
      await this.connection.transaction(async (manager: EntityManager) => {
        const take = options.limit || 10;
        const page = options?.page || 1;
        const skip = (page - 1) * options?.limit;

        const data = await manager.findAndCount(Follow, {
          where: {
            userFollow: userId,
          },
          order: { createdAt: 'DESC' },
          take,
          skip,
        });
        response = paginateResponse(data, { page, limit: take });
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
  async getFollower(
    userId: number,
    options: PaginationOptions,
  ): Promise<PayloadResponse> {
    try {
      let response: PayloadResponse;
      await this.connection.transaction(async (manager: EntityManager) => {
        const take = options.limit || 10;
        const page = options?.page || 1;
        const skip = (page - 1) * options?.limit;

        const data = await manager.findAndCount(Follow, {
          where: {
            userIsFollowed: userId,
          },
          order: { createdAt: 'DESC' },
          take,
          skip,
        });
        response = paginateResponse(data, { page, limit: take });
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
  async getUser(userId: number, query: QueryUserInput): Promise<User> {
    try {
      let response: User;
      await this.connection.transaction(async (manager: EntityManager) => {
        const { relations } = query;

        response = await manager.findOne(User, {
          where: { id: userId },
          relations: relations || ['userInformation'],
        });
        return response;
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
}
