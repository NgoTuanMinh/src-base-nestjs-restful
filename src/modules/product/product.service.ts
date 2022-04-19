import { Injectable } from '@nestjs/common';
import { Product } from 'src/entities/product.entity';
import { Tag } from 'src/entities/tag.entity';
import { User } from 'src/entities/user.entity';
import { BadRequestExceptionCustom } from 'src/exceptions/bad-request.exception ';
import { paginateResponse, PayloadResponse } from 'src/utils/paginationUtils';
import { Connection, EntityManager } from 'typeorm';
import { CreateProductInput, GetListProductOwnerInput, LikeProductInput } from './dto/create-product.input';
import { ProductRepository } from './product.repository';
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
          async (tagType: string) => {

            const checkTagInDB = await manager.findOne(Tag, {
              where: { type: tagType }
            })

            let tag: Tag;
            if (!checkTagInDB) {
              const newTag = manager.create(Tag, {
                type: tagType,
              })
              tag = await manager.save(newTag);
            } else {
              tag = checkTagInDB;
            }

            return manager.save(tag);
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

  /**
   * find one unions
   * @param id
   * @returns
   */
   async likeProduct(
    data: LikeProductInput,
    userId: number,
  ): Promise<any> {
    try {
      let response;
      await this.connection.transaction(async (manager: EntityManager) => {
        const { productId } = data;

        const currentUser = await manager.findOne(User, {
          where: {
            id: userId,
          },
          relations: ['favouriteProduct']
        });        

        if (!currentUser) {
          throw new BadRequestExceptionCustom('Failed to like this product. Try againt.');
        }

        const product = await manager.findOne(Product, {
          where: {
            id: productId,
          }
        })

        if (!currentUser) {
          throw new BadRequestExceptionCustom('Failed to like this product. Try againt.');
        }

        const listOldFavouriteProduct = currentUser.favouriteProduct && currentUser.favouriteProduct.length > 0
        ?
        currentUser.favouriteProduct
        :
        [];

        const checkLikedProduct = (listOldFavouriteProduct.findIndex(
          (favouriteProduct: Product) => Number(favouriteProduct.id) === Number(productId))
        ) !== -1;
        
        const listNewFavouriteProduct = !checkLikedProduct
        ?
        [...listOldFavouriteProduct , product]
        :
        [...listOldFavouriteProduct];
        
        currentUser.favouriteProduct = listNewFavouriteProduct;
        response = await manager.save(currentUser); 
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * find one unions
   * @param id
   * @returns
   */
   async getListProductOwner(
    input: GetListProductOwnerInput,
    userId: number,
  ): Promise<PayloadResponse> {
    try {
      let response;
      await this.connection.transaction(async (manager: EntityManager) => {
        const { relations, limit, page = 1 } = input;

        const take = limit || 10;
        const skip = (page - 1) *limit;

        const data = await manager.findAndCount(Product, {
          where: {
            owner: userId,
          },
          relations: relations || [],
          order: {updatedAt: 'DESC'},
          take,
          skip
        });
        response = paginateResponse(data, {page, limit: take});
        return response;
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

}
