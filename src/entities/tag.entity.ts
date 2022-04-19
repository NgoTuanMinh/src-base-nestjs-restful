import { Column, Entity } from 'typeorm';
import { CommonEntity } from './common.entity';

@Entity('tag')
export class Tag extends CommonEntity {
  @Column({
    type: 'varchar',
    name: 'type',
  })
  type: string;
}
