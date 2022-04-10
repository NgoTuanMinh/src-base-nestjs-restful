import { Injectable } from '@nestjs/common';
import { Product } from 'src/entities/product.entity';
import { User } from 'src/entities/user.entity';
import { Connection, getManager } from 'typeorm';
import { CreateProductInput } from './dto/create-product.input';
import { ProductRepository } from './product.repository';
import _ from 'lodash';
import { Test } from 'src/entities/test.entity';
@Injectable()
export class ProductService {
  constructor(
    public repository: ProductRepository,
    private connection: Connection,
  ) {}

  /**
   * find one unions
   * @param id
   * @returns
   */
  async findAll(): Promise<Array<Product>> {
    const list = await this.repository.find();
    return list;
  }

  async findTest(): Promise<Array<Test>> {
    const list = await getManager().find(Test);
    return list;
  }

  /**
   * find one unions
   * @param id
   * @returns
   */
  async create(
    data: CreateProductInput,
    currentUserId: number,
  ): Promise<Product> {
    const { name, price } = data;
    const currentUser = await getManager().findOne(User, {
      id: currentUserId,
    });

    const newProduct = this.repository.create({
      name,
      price,
      user: currentUser,
    });
    const resultCreate = await this.repository.save(newProduct);
    return resultCreate;
  }
}
