import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { config } from 'src/common';
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
  ],
  providers: [TokenService, JwtStrategy, JwtAuthenticationGuard],
  exports: [PassportModule, TokenService],
})
export class AuthenticationModule {}
