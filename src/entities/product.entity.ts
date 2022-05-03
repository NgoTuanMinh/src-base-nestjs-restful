import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { CommonEntity } from './common.entity';
import { Tag } from './tag.entity';

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
    nullable: true,
  })
  imageUrl: string;

  @Column({
    type: 'varchar',
    name: 'description',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'bigint',
    name: 'owner',
    nullable: true,
  })
  owner: number;

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];
}
