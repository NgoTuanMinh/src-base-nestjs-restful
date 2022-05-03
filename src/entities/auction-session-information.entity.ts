import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Bid } from './bid.entity';
import { CommonEntity } from './common.entity';

@Entity('auction_session_information')
export class AuctionSessionInformation extends CommonEntity {
  @Column({
    type: 'bigint',
    name: 'rating',
    default: 0,
  })
  rating: number;

  @Column({
    type: 'timestamp with time zone',
    name: 'timeEnd',
    default: new Date().toISOString(),
  })
  timeEnd: Date;

  @Column({
    type: 'float',
    name: 'reservePrice',
  })
  reservePrice: number;

  @OneToOne(() => Bid)
  @JoinColumn()
  largestBid: Bid;
}
