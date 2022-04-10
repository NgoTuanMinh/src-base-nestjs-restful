import { genSaltSync, hashSync } from 'bcryptjs';
import { SALT_ROUND } from 'src/common';
import { BeforeInsert, Column, Entity, Generated, OneToMany } from 'typeorm';
import { CommonEntity } from './common.entity';
import { Product } from './product.entity';

@Entity('user')
export class User extends CommonEntity {
  @Column({
    type: 'varchar',
    name: 'user_name',
    nullable: true,
  })
  userName: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'password',
    nullable: true,
    select: false,
  })
  public password: string;

  @Column({
    name: 'uuid',
  })
  @Generated('uuid')
  uuid: string;

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @BeforeInsert()
  hashPassword() {
    if (this.password) {
      this.password = hashSync(this.password, genSaltSync(SALT_ROUND));
    }
  }
}
