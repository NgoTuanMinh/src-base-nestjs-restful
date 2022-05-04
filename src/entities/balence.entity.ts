import { Column, Entity } from 'typeorm';
import { CommonEntity } from './common.entity';

@Entity('balence')
export class Balence extends CommonEntity {
  @Column({
    type: 'bigint',
    name: 'userId',
  })
  userId: number;

  @Column({
    type: 'float',
    name: 'amount',
  })
  amount: number;

  @Column({
    type: 'varchar',
    name: 'cardNumber',
    nullable: true,
  })
  cardNumber: string;
}
