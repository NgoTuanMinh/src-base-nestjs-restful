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

export class GetListAuctionsInput {
  relations?: string[];
  limit?: number;
  page?: number;
}
export class GetListBidsInput {
  relations?: string[];
  auctionSessionId?: number;
  limit?: number;
  page?: number;
}
