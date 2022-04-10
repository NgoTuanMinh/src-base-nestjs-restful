import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { LoginInput } from './dto/login.input';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
  ) {}
  @Post()
  create(@Body() data: CreateUserInput): Promise<User> {
    return this.userService.create(data);
  }

  @Post('/login')
  async login(@Body() data: LoginInput): Promise<User> {
    return await this.userService.handleLogin(data);
  }

  @Get()
  getAllUser(): Promise<Array<User>> {
    return this.userRepository.find();
  }
}
