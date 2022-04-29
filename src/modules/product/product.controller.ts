import {
  Body,
  Controller, Get, Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { CurrentAccount } from 'src/decorators/current-account.decorator';
import { Product } from 'src/entities/product.entity';
import { PayloadResponse } from 'src/utils/paginationUtils';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import { CreateProductInput, GetListProductOwnerInput, LikeProductInput } from './dto/create-product.input';
import { ProductService } from './product.service';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/create-product')
  @UseGuards(JwtAuthenticationGuard)
  createProduct(
    @CurrentAccount() account: any,
    @Body() data: CreateProductInput,
  ): Promise<Product> {
    return this.productService.createProduct(data, Number(account?.id));
  }

  @Post('/like-product')
  @UseGuards(JwtAuthenticationGuard)
  likeProduct(
    @CurrentAccount() account: any,
    @Body() data: LikeProductInput,
  ): Promise<Product> {
    return this.productService.likeProduct(data, Number(account?.id));
  }

  @Get('/list-product-owner')
  @UseGuards(JwtAuthenticationGuard)
  getListProductOwner(
    @CurrentAccount() account: any,
    @Query() data: GetListProductOwnerInput,
  ): Promise<PayloadResponse> {
    return this.productService.getListProductOwner(data, Number(account?.id));
  }
}
