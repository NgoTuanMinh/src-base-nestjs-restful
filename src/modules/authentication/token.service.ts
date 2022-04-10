import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectConnection } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Connection, EntityManager } from 'typeorm';

interface TokenPayload {
  id?: number;
  userName?: string;
  accessKey?: string;
}

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    @InjectConnection() private connection: Connection,
  ) {}

  /**
   *
   * @param id
   * @param expireTime
   * @returns
   */
  async generateToken(payload: TokenPayload, expireTime: any): Promise<string> {
    const data = this.jwtService.sign(payload, { expiresIn: expireTime });
    return data;
  }

  /**
   * when expried token then will error
   * @param token
   * @returns
   */
  async verifyToken(token: string): Promise<any> {
    let verifiedToken: any;
    try {
      verifiedToken = this.jwtService.verify(token);
    } catch (err) {
      throw err;
    }
    return verifiedToken;
  }

  async decodeToken(token: string): Promise<any> {
    let decodeToken: any;
    try {
      decodeToken = this.jwtService.decode(token);
    } catch (err) {
      throw err;
    }
    return decodeToken;
  }

  async validateAccount(payload: TokenPayload): Promise<boolean> {
    let isExistAccount = false;
    try {
      await this.connection.transaction(async (manager: EntityManager) => {
        const user = await manager.findOne(User, {
          where: { id: payload?.id },
          withDeleted: true,
        });
        // check user normal
        if (user) {
          isExistAccount = true;
        }
      });
    } catch (err) {
      throw err;
    }

    return isExistAccount;
  }

  async decodedToken(token: string): Promise<any> {
    let decodedToken: any;
    try {
      decodedToken = this.jwtService.decode(token);
    } catch (err) {}
    return decodedToken;
  }
}
