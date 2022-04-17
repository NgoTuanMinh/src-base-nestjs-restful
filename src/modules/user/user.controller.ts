import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserInformation } from 'src/entities/user-information.entity';
import { CurrentAccount } from 'src/decorators/current-account.decorator';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import { UpdateUserInfoInput, UpdateUserSocialNetwork } from './dto/user.input';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
  ) {}
  @Post('/create-account')
  create(@Body() data: CreateUserInput): Promise<User> {
    return this.userService.create(data);
  }

  @Post('/update-user-info')
  @UseGuards(JwtAuthenticationGuard)
  async updateUserInfo(
    @Body() data: UpdateUserInfoInput,
    @CurrentAccount() account: any,
  ): Promise<UserInformation> {
    return await this.userService.updateUserInfo(data, account?.id);
  }

  @Post('/update-user-social-network')
  @UseGuards(JwtAuthenticationGuard)
  async updateSocialNetwork(
    @Body() data: UpdateUserSocialNetwork[],
    @CurrentAccount() account: any,
  ): Promise<UserInformation> {
    console.log('data', data);
    return await this.userService.updateUserSocialNetwork(data, account?.id);
  }

  @Get('/all-user')
  getAllUser(): Promise<Array<User>> {
    return this.userRepository.find({
      relations: ['userInformation'],
    });
  }
}
