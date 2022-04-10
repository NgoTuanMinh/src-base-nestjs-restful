import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from 'nest-router';
import { config } from 'src/common/environment.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ROUTERS } from './config/router';
import { DatabaseModule } from './database/database.module';
import { MODULES } from './modules';
import { AuthenticationModule } from './modules/authentication/authentication.module';

@Module({
  imports: [
    // read environment variable
    ConfigModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: config.redisHost,
        port: config.redisPort,
      },
    }),
    RouterModule.forRoutes(ROUTERS),
    DatabaseModule,
    AuthenticationModule,
    ...MODULES,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
