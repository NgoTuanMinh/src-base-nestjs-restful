import { Column, Entity } from 'typeorm';
import { CommonEntity } from './common.entity';

@Entity('test')
export class Test extends CommonEntity {
  @Column({
    type: 'varchar',
    name: 'object_key',
  })
  objectKey: string;

  @Column({
    type: 'varchar',
    name: 'union_name',
  })
  unionName: string;

  @Column({
    type: 'bigint',
    name: 'target_year_month',
  })
  targetYearMonth: number;
}
