import { TypeSocialNetwork } from 'src/common';
import { Column, Entity } from 'typeorm';
import { CommonEntity } from './common.entity';

@Entity('user_social_network')
export class UserSocialNetwork extends CommonEntity {
  @Column({
    type: 'varchar',
    name: 'type',
    nullable: true,
    enum: TypeSocialNetwork
  })
  type: string;

  @Column({
    type: 'varchar',
    name: 'linkSocialNetwork',
    nullable: true,
  })
  linkSocialNetwork: string;
  
  @Column({
    type: 'varchar',
    name: 'displayNameSocial',
    nullable: true,
  })
  displayNameSocial: string;

  @Column({
    type: 'int',
    name: 'userId',
  })
  userId: number;
}
