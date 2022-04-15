import { genSaltSync, hashSync } from 'bcryptjs';
import { SALT_ROUND } from 'src/common';
import { BeforeInsert, Column, Entity, Generated, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { Product } from './product.entity';
import { UserInformation } from './user-information.entity';

@Entity('user')
export class User extends CommonEntity {
  @Column({
    type: 'varchar',
    name: 'userName',
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
    type: 'boolean',
    name: 'isLogged',
    nullable: false,
    default: false,
  })
  isLogged: boolean;
  
  @Column({
    name: 'uuid',
  })
  @Generated('uuid')
  uuid: string;

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @OneToOne(() => UserInformation)
  @JoinColumn()
  userInformation: UserInformation;

  @BeforeInsert()
  hashPassword() {
    if (this.password) {
      this.password = hashSync(this.password, genSaltSync(SALT_ROUND));
    }
  }
}
