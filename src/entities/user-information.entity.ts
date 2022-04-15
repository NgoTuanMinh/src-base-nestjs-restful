import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { User } from './user.entity';

@Entity('user_information')
export class UserInformation extends CommonEntity {
  @Column({
    type: 'int',
    name: 'rating',
    nullable: true,
    default: 0
  })
  rating: number;

  @Column({
    type: 'varchar',
    name: 'profileImage',
    nullable: true,
  })
  profileImage: string;
  
  @Column({
    type: 'varchar',
    name: 'bio',
    nullable: true,
  })
  bio: string;

  @Column({
    type: 'varchar',
    name: 'displayName',
    nullable: true,
  })
  displayName: string;

  @Column({
    type: 'varchar',
    name: 'email',
    nullable: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    name: 'phoneNumber',
    nullable: true,
  })
  phoneNumber: string;

  @Column({
    type: 'int',
    name: 'userId',
    nullable: true,
  })
  userId: number;
}
