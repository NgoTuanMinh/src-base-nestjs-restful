import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { AuctionSessionInformation } from './auction-session-information.entity';
import { CommonEntity } from './common.entity';
import { Product } from './product.entity';
import { User } from './user.entity';

@Entity('auction_session')
export class AuctionSession extends CommonEntity {
  @Column({
    type: 'boolean',
    name: 'isSold',
    default: false,
  })
  isSold: boolean;

  @Column({
    type: 'boolean',
    name: 'isFinished',
    default: false,
  })
  isFinished: boolean;

  @ManyToOne(() => User)
  @JoinColumn()
  seller: User;

  @ManyToOne(() => Product)
  @JoinColumn()
  product: Product;

  @OneToOne(() => AuctionSessionInformation)
  @JoinColumn()
  sessionInformation: AuctionSessionInformation;
}
