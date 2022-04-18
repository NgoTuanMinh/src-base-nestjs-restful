import { Injectable } from '@nestjs/common';
import { Product } from 'src/entities/product.entity';
import { User } from 'src/entities/user.entity';
import { Connection, EntityManager, getManager } from 'typeorm';
import { CreateProductInput } from './dto/create-product.input';
import { ProductRepository } from './product.repository';
import _ from 'lodash';
import { Test } from 'src/entities/test.entity';
import { TagProduct } from 'src/entities/tag.entity';
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
   async createProduct(
    data: CreateProductInput,
    userId: number,
  ): Promise<any> {
    try {
      let response;
      await this.connection.transaction(async (manager: EntityManager) => {
        const { name, imageUrl, description, tags } = data;

        const newProduct = manager.create(Product, {
          name,
          owner: userId,
          imageUrl,
          description,
        })

        const resultProductCreate = await manager.save(newProduct);
        if (tags.length === 0) { 
          return;
        }
        const listPromise = tags.map(
          async (tag: string) => {
            const newTagProduct = manager.create(TagProduct, {
              tag,
              product: resultProductCreate,
            })
            return manager.save(newTagProduct);
          },
        );
        const listTagCreated = await Promise.all(listPromise);
        resultProductCreate.tags = listTagCreated;
        response = await manager.save(resultProductCreate); 
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

}
