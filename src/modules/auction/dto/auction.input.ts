export class CreateAuctionInput {
  productId: number;
  timeEnd: Date;
  reservePrice: number;
}

export class PlaceBidInput {
  auctionSessionId: number;
  bidPrice: number;
}