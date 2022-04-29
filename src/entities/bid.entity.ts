import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { AuctionSession } from './auction-session.entity';
import { CommonEntity } from './common.entity';
import { User } from './user.entity';

@Entity('bid')
export class Bid extends CommonEntity {
  @Column({
    type: 'float',
    name: 'bidPrice',
    default: 0,
  })
  bidPrice: number;
  
  @ManyToOne(() => User)
  @JoinColumn()
  bidBy: User;

  @ManyToOne(() => AuctionSession)
  @JoinColumn()
  auctionSession: AuctionSession;
}
