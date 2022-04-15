import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class CommonEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    unsigned: true,
    comment: 'Primary Key',
    name: 'id',
  })
  id?: number;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    name: 'createdAt',
  })
  createdAt: Date;

  @DeleteDateColumn({
    type: 'timestamp with time zone',
    name: 'deletedAt',
    default: null,
    nullable: true,
  })
  deletedAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    name: 'updatedAt',
    default: null,
    nullable: true,
  })
  updatedAt: Date;

  @Column({
    type: 'boolean',
    name: 'isDeleted',
    default: false,
  })
  isDeleted: boolean;
}
