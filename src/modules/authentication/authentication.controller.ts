import { Body, Controller, Post } from '@nestjs/common';
import { LoginInput, RefreshTokenInput } from './dto/authentication.input';
import { LoginOutput } from './dto/authentication.output';
import { AuthenticationService } from './authentication.service';

@Controller()
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}
  @Post('/login')
  async login(@Body() data: LoginInput): Promise<LoginOutput> {
    return await this.authService.handleLogin(data);
  }

  @Post('/refresh-token')
  async refreshToken(@Body() data: RefreshTokenInput): Promise<LoginOutput> {
    return await this.authService.refreshToken(data);
  }

  // @Get('/all-user')
  // getAllUser(): Promise<Array<User>> {
  //   return this.userRepository.find({
  //     relations: ['userInformation'],
  //   });
  // }
}
