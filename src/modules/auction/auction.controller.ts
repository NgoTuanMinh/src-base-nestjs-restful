import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentAccount } from 'src/decorators/current-account.decorator';
import { AuctionSession } from 'src/entities/auction-session.entity';
import { Bid } from 'src/entities/bid.entity';
import { PayloadResponse } from 'src/utils/paginationUtils';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import { AuctionService } from './auction.service';
import {
  CreateAuctionInput,
  GetListAuctionsInput,
  PlaceBidInput,
  ViewAuctionInput,
} from './dto/auction.input';

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
  closeAuction(@Body() data: any): Promise<any> {
    return this.auctionService.closeAuctionSession(data);
  }

  @Post('/view-auction')
  @UseGuards(JwtAuthenticationGuard)
  viewAuction(
    @CurrentAccount() account: any,
    @Body() data: ViewAuctionInput,
  ): Promise<any> {
    return this.auctionService.viewAuctionSession(
      data?.auctionSessionId,
      account?.id,
    );
  }

  @Get('/list-auction')
  @UseGuards(JwtAuthenticationGuard)
  listAuction(@Query() data: GetListAuctionsInput): Promise<PayloadResponse> {
    return this.auctionService.getListAuction(data);
  }
}
