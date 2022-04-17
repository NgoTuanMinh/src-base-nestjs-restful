import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'src/common';
import { User } from 'src/entities/user.entity';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import JwtAuthenticationGuard from './jwt-authentication.guard';
import { JwtStrategy } from './jwt.strategy';
import { TokenService } from './token.service';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'account',
      session: false,
    }),
    JwtModule.register({
      secret: config.jwtSecretKey,
      signOptions: { expiresIn: config.expireTime },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthenticationController],
  providers: [
    TokenService,
    JwtStrategy,
    JwtAuthenticationGuard,
    AuthenticationService,
  ],
  exports: [PassportModule, TokenService],
})
export class AuthenticationModule {}
