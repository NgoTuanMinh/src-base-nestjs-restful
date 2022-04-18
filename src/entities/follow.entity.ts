import { Column, Entity } from 'typeorm';
import { CommonEntity } from './common.entity';

@Entity('follow')
export class Follow extends CommonEntity {
  @Column({
    type: 'bigint',
    name: 'userFollow',
  })
  userFollow: number;

  @Column({
    type: 'bigint',
    name: 'userIsFollowed',
  })
  userIsFollowed: number;
}
