import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { User } from './user.entity';

@Entity('product')
export class Product extends CommonEntity {
  @Column({
    type: 'varchar',
    name: 'name',
  })
  name: string;

  @Column({
    type: 'bigint',
    name: 'price',
  })
  price: number;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;
}
