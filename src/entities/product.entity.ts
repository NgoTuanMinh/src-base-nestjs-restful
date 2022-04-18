import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { TagProduct } from './tag.entity';
import { User } from './user.entity';

@Entity('product')
export class Product extends CommonEntity {
  @Column({
    type: 'varchar',
    name: 'name',
  })
  name: string;

  @Column({
    type: 'varchar',
    name: 'imageUrl',
  })
  imageUrl: string;

  @Column({
    type: 'varchar',
    name: 'description',
    nullable: true
  })
  description: string;

  @Column({
    type: 'bigint',
    name: 'owner',
  })
  owner: number;

  @OneToMany(() => TagProduct, (tag) => tag.product)
  tags: TagProduct[];
}
