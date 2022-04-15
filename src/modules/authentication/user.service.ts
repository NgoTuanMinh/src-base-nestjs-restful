import { Injectable } from '@nestjs/common';
import { config, TokenType } from 'src/common';
import { User } from 'src/entities/user.entity';
import { Connection, EntityManager, getConnection } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { LoginInput, LoginNormalField, RefreshTokenInput, UpdateUserInfoInput, UpdateUserSocialNetwork } from './dto/authentication.input';
import { UserRepository } from './user.repository';
import * as md5 from 'md5';
import { TokenService } from './token.service';
import { compareSync } from 'bcryptjs';
import { LoginOutput } from './dto/authentication.output';
import to from 'await-to-js';
import { BadRequestExceptionCustom } from 'src/exceptions/bad-request.exception ';
import { ConflictExceptionCustom } from 'src/exceptions/conflict.exception ';
import { NotFoundExceptionCustom } from 'src/exceptions/notfound.exception';
import { UserInformation } from 'src/entities/user-information.entity';
import { UserSocialNetwork } from 'src/entities/user-social-network.entity';

@Injectable()
export class UserService {
  constructor(
    public repository: UserRepository,
    private connection: Connection,
    private readonly tokenService: TokenService,
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

  async handleGenerateAuthenToken(account: LoginInput): Promise<LoginOutput> {
    try {
      let data = new LoginOutput();
      await this.connection.transaction(async () => {
        const accessKey = md5(
          account.id + TokenType.ACCESS_TOKEN + new Date().getTime().toString(),
        );
        const accessToken = await this.tokenService.generateToken(
          {
            id: account.id,
            accessKey: accessKey,
          },
          config.expireTime,
        );

        const refreshToken = await this.tokenService.generateToken(
          {
            id: account.id,
            accessKey: accessKey,
          },
          config.expireTimeRefreshToken,
        );

        data = {
          accessToken: accessToken,
          refreshToken: refreshToken,
          expireTime: config.expireTime,
        };
        return data;
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async handleLogin(input: LoginInput): Promise<LoginOutput> {
    try {
      let data = new LoginOutput();
      await this.connection.transaction(async (manager: EntityManager) => {
        const user = await manager.findOne(User, {
          where: { userName: input?.userName },
          select: ['id', 'password'],
        });

        if (!user) return null;

        const validatePassword = compareSync(input?.password, user?.password);
        if (!validatePassword) {
          throw new BadRequestExceptionCustom('Wrong password');
        }

        const dataAccount = {
          userName: user?.userName,
          id: user?.id,
        };

        data = await this.handleGenerateAuthenToken(dataAccount);
        return data;
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(input: RefreshTokenInput): Promise<LoginOutput> {
    try {
      let data = new LoginOutput();
      await this.connection.transaction(async (manager: EntityManager) => {

        const { refreshToken } = input;

        const [errAccounDecode, accountDecode] = await to(
          this.tokenService.decodeToken(refreshToken),
        );
        if (!accountDecode || errAccounDecode) {
          throw new BadRequestExceptionCustom('Token was wrong');
        }
        const currentUserId = accountDecode?.id;

        const [errAccountVerify, accountVerify] = await to(
          this.tokenService.verifyToken(refreshToken),
        );

        if (!accountVerify || errAccountVerify) {
          await getConnection()
            .createQueryBuilder()
            .update(User)
            .set({
              isLogged: false
            })
            .where('id = :id', { id: currentUserId })
            .execute()
        }

        const user = await manager.findOne(User, {
          where: { id: currentUserId }
        });

        if (!user){
          throw new NotFoundExceptionCustom('Account not exist');
        }

        const dataAccount = {
          userName: user?.userName,
          id: user?.id,
        };

        data = await this.handleGenerateAuthenToken(dataAccount);
        return data;
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * find one unions
   * @param id
   * @returns
   */
   async updateUserInfo(data: UpdateUserInfoInput, userId: number): Promise<UserInformation> {
    try {
      const {
        profileImage,
        bio,
        displayName,
        email,
        phoneNumber,
      } = data;
      let result;
      await this.connection.transaction(async (manager: EntityManager) => {
        const currentUser = await this.repository.findOne({
          where: { id: userId },
        });

        if (!currentUser) {
          throw new ConflictExceptionCustom('Account not exist');
        }

        let currentUserInfoToUpdate = new UserInformation();
        const currentUserInfo = await manager.findOne(UserInformation,
          {
            where: {
              userId: currentUser?.id
            }
          }  
        )

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
   async updateUserSocialNetwork(data: UpdateUserSocialNetwork[], userId: number): Promise<any> {
    try {
      if (data.length === 0) return;
      const listItem = data.map((item: UpdateUserSocialNetwork) => (
        {
          userId,
          displayNameSocial: item?.displayNameSocial,
          linkSocialNetwork: item?.linkSocialNetwork,
          type: item?.type,
        }
      ))
      let success = false;      
      await this.connection.transaction(async (manager: EntityManager) => {
        const listPromise = listItem.map(async (itemUpdate: UpdateUserSocialNetwork) => {
          const userSocialNetworkDb = await manager.findOne(UserSocialNetwork, {
            where: {
              type: itemUpdate?.type,
              userId: userId,
            }
          })
          if (userSocialNetworkDb) {
            userSocialNetworkDb.linkSocialNetwork = itemUpdate?.linkSocialNetwork,
            userSocialNetworkDb.displayNameSocial = itemUpdate?.displayNameSocial,
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
        })
        await Promise.all(listPromise);
        success = true;
      });
      return success;
    } catch (error) {
      throw error;
    }
  }
}
