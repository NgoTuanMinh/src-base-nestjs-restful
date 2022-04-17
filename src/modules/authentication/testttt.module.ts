import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'src/common';
import { User } from 'src/entities/user.entity';
import { TokenService } from './token.service';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: config.jwtSecretKey,
      signOptions: { expiresIn: config.expireTime },
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, TokenService],
  exports: [AuthenticationService],
})
export class TestModule {}
