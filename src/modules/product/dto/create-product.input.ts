export class CreateProductInput {
  name?: string;
  imageUrl?: string;
  description?: string;
  tags?: string[];
}

export class LikeProductInput {
  productId: number;
}

export class GetListProductOwnerInput {
  relations?: string[];
  limit?: number;
  page?: number;
}