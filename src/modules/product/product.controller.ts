import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserDecorator } from 'src/decorators/user.decorator';
import { CurrentAccount } from 'src/decorators/current-account.decorator';
import { Product } from 'src/entities/product.entity';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import { CreateProductInput } from './dto/create-product.input';
import { ProductService } from './product.service';
import { Test } from 'src/entities/test.entity';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @HttpCode(200)
  @Get()
  @UseGuards(JwtAuthenticationGuard)
  getAll(@CurrentAccount() account: any): Promise<Array<Product>> {
    console.log('user=====', account);
    return this.productService.findAll();
  }

  @HttpCode(200)
  @Get('/paymentnotice/now')
  getTest(): Promise<Array<Test>> {
    return this.productService.findTest();
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  createProduct(
    @CurrentAccount() account: any,
    @Body() data: CreateProductInput,
  ): Promise<Product> {
    console.log('user', account);

    return this.productService.create(data, Number(account?.id));
  }
}
