import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserInformation } from 'src/entities/user-information.entity';
import { CurrentAccount } from 'src/decorators/current-account.decorator';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import {
  QueryUserInput,
  UpdateUserInfoInput,
  UpdateUserSocialNetwork,
} from './dto/user.input';
import { PaginationOptions, PayloadResponse } from 'src/utils/paginationUtils';

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
    return await this.userService.updateUserSocialNetwork(data, account?.id);
  }

  @Post('/handle-follow')
  @UseGuards(JwtAuthenticationGuard)
  async handleFollow(
    @Body() data: { userIsFolled: number },
    @CurrentAccount() account: any,
  ): Promise<UserInformation> {
    return await this.userService.handleFolow(data?.userIsFolled, account?.id);
  }

  @Post('/handle-unfollow')
  @UseGuards(JwtAuthenticationGuard)
  async handleUnFollow(
    @Body() data: { userIsFolled: number },
    @CurrentAccount() account: any,
  ): Promise<UserInformation> {
    return await this.userService.handleUnFolow(
      data?.userIsFolled,
      account?.id,
    );
  }

  @Get('/get-following')
  @UseGuards(JwtAuthenticationGuard)
  getFollowing(
    @Body() data: PaginationOptions,
    @CurrentAccount() account: any,
  ): Promise<PayloadResponse> {
    return this.userService.getFollowing(account?.id, data);
  }

  @Get('/get-follower')
  @UseGuards(JwtAuthenticationGuard)
  getFollower(
    @Body() data: PaginationOptions,
    @CurrentAccount() account: any,
  ): Promise<PayloadResponse> {
    return this.userService.getFollower(account?.id, data);
  }

  @Get('/all-user')
  getAllUser(): Promise<Array<User>> {
    return this.userRepository.find({
      relations: ['userInformation'],
    });
  }

  @Get('/user-info')
  @UseGuards(JwtAuthenticationGuard)
  getUser(
    @Query() query: QueryUserInput,
    @CurrentAccount() account: any,
  ): Promise<User> {
    return this.userService.getUser(Number(account?.id), query);
  }
}
