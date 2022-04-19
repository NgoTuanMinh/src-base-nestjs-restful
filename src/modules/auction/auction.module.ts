import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionSessionInformation } from 'src/entities/auction-session-information.entity';
import { AuctionSession } from 'src/entities/auction-session.entity';
import { Bid } from 'src/entities/bid.entity';
import { AuctionController } from './auction.controller';
import { AuctionService } from './auction.service';

@Module({
  imports: [TypeOrmModule.forFeature([AuctionSession, AuctionSessionInformation, Bid])],
  controllers: [AuctionController],
  providers: [AuctionService],
  exports: [AuctionService],
})
export class AuctionModule {}
