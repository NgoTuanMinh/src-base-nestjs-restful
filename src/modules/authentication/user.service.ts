import { Injectable } from '@nestjs/common';
import { config, TokenType } from 'src/common';
import { User } from 'src/entities/user.entity';
import { Connection, EntityManager } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { LoginInput, LoginNormalField } from './dto/login.input';
import { UserRepository } from './user.repository';
import * as md5 from 'md5';
import { TokenService } from './token.service';
import { compareSync } from 'bcryptjs';

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
          throw new Error('Account exist');
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

  async handleGenerateAuthenToken(account: LoginInput): Promise<any> {
    try {
      let data = new LoginNormalField();
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

  async handleLogin(input: LoginInput): Promise<any> {
    try {
      let data = new LoginNormalField();
      await this.connection.transaction(async (manager: EntityManager) => {
        const user = await manager.findOne(User, {
          where: { userName: input?.userName },
          select: ['id', 'password'],
        });

        if (!user) return null;

        const validatePassword = compareSync(input?.password, user?.password);
        if (!validatePassword) {
          throw new Error('Wrong password');
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
