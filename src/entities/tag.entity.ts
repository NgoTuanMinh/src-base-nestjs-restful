import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { Product } from './product.entity';

@Entity('tag_product')
export class TagProduct extends CommonEntity {
  @Column({
    type: 'varchar',
    name: 'tag',
  })
  tag: string;
  
  @ManyToOne(() => Product)
  @JoinColumn()
  product: Product;
}
