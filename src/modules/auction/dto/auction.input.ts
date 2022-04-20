export class CreateAuctionInput {
  productId: number;
  timeEnd: Date;
  reservePrice: number;
}

export class PlaceBidInput {
  auctionSessionId: number;
  bidPrice: number;
}

export class CloseAuctionSessionInput {
  auctionSessionId: number;
  timeEnd: Date;
}

export class ViewAuctionInput {
  auctionSessionId: number;
}