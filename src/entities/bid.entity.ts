import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { AuctionSession } from './auction-session.entity';
import { CommonEntity } from './common.entity';
import { User } from './user.entity';

@Entity('bid')
export class Bid extends CommonEntity {
  @Column({
    type: 'bigint',
    name: 'bidPrice',
    default: 0,
  })
  bidPrice: number;
  
  @OneToOne(() => User)
  @JoinColumn()
  bidBy: User;

  @OneToOne(() => AuctionSession)
  @JoinColumn()
  auctionSession: AuctionSession;
}
