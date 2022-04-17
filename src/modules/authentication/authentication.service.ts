import { Injectable } from '@nestjs/common';
import to from 'await-to-js';
import { compareSync } from 'bcryptjs';
import * as md5 from 'md5';
import { config, TokenType } from 'src/common';
import { User } from 'src/entities/user.entity';
import { BadRequestExceptionCustom } from 'src/exceptions/bad-request.exception ';
import { NotFoundExceptionCustom } from 'src/exceptions/notfound.exception';
import { Connection, EntityManager, getConnection } from 'typeorm';
import { LoginInput, RefreshTokenInput } from './dto/authentication.input';
import { LoginOutput } from './dto/authentication.output';
import { TokenService } from './token.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private connection: Connection,
    private readonly tokenService: TokenService,
  ) {}

  // /**
  //  * find one unions
  //  * @param id
  //  * @returns
  //  */
  // async findAll(): Promise<Array<User>> {
  //   const list = await this.repository.find();
  //   return list;
  // }

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

        if (!user) {
          throw new BadRequestExceptionCustom('Incorrect username or password');
        }

        const validatePassword = compareSync(input?.password, user?.password);
        if (!validatePassword) {
          throw new BadRequestExceptionCustom('Incorrect username or password');
        }

        const dataAccount = {
          userName: user?.userName,
          id: user?.id,
        };

        data = await this.handleGenerateAuthenToken(dataAccount);
        console.log('data', data);

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
              isLogged: false,
            })
            .where('id = :id', { id: currentUserId })
            .execute();
        }

        const user = await manager.findOne(User, {
          where: { id: currentUserId },
        });

        if (!user) {
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
}
