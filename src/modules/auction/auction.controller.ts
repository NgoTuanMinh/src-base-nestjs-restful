import {
  Body,
  Controller, Post,
  UseGuards
} from '@nestjs/common';
import { CurrentAccount } from 'src/decorators/current-account.decorator';
import { AuctionSession } from 'src/entities/auction-session.entity';
import { Bid } from 'src/entities/bid.entity';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import { AuctionService } from './auction.service';
import { CreateAuctionInput, PlaceBidInput } from './dto/auction.input';

@Controller()
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Post('/create-auction-session')
  @UseGuards(JwtAuthenticationGuard)
  createAuctionSession(
    @CurrentAccount() account: any,
    @Body() data: CreateAuctionInput,
  ): Promise<AuctionSession> {
    return this.auctionService.createAuctionSession(data, Number(account?.id));
  }

  @Post('/place-bid')
  @UseGuards(JwtAuthenticationGuard)
  placeABid(
    @CurrentAccount() account: any,
    @Body() data: PlaceBidInput,
  ): Promise<Bid> {
    return this.auctionService.placeBid(data, Number(account?.id));
  }

  @Post('/close-auction')
  // @UseGuards(JwtAuthenticationGuard)
  closeAuction(
    @Body() data: any,
  ): Promise<any> {
    return this.auctionService.closeAuctionSession(data);
  }
}
