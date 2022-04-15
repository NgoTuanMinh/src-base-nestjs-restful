import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { LoginInput, RefreshTokenInput, UpdateUserInfoInput, UpdateUserSocialNetwork } from './dto/authentication.input';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { LoginOutput } from './dto/authentication.output';
import { UserInformation } from 'src/entities/user-information.entity';
import JwtAuthenticationGuard from './jwt-authentication.guard';
import { CurrentAccount } from 'src/decorators/current-account.decorator';

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

  @Post('/login')
  async login(@Body() data: LoginInput): Promise<LoginOutput> {
    return await this.userService.handleLogin(data);
  }

  @Post('/refresh-token')
  async refreshToken(@Body() data: RefreshTokenInput): Promise<LoginOutput> {
    return await this.userService.refreshToken(data);
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
      relations: ['userInformation']
    });
  }
}
