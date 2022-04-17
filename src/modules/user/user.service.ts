import { Injectable } from '@nestjs/common';
import { UserInformation } from 'src/entities/user-information.entity';
import { UserSocialNetwork } from 'src/entities/user-social-network.entity';
import { User } from 'src/entities/user.entity';
import { ConflictExceptionCustom } from 'src/exceptions/conflict.exception ';
import { Connection, EntityManager } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInfoInput, UpdateUserSocialNetwork } from './dto/user.input';
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
}
