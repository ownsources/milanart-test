import { Controller, Post, Body } from '@nestjs/common';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginLocalRequestDto } from './dto/login-request.dto';
import { SignUpLocalRequestDto } from './dto/sign-up-local-request.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('sign-up')
  public async signUp(
    @Body() signUpLocalRequest: SignUpLocalRequestDto,
  ): Promise<UserResponseDto> {
    return this.userService.create(signUpLocalRequest);
  }

  @Post('login')
  public async login(
    @Body() loginLocalRequest: LoginLocalRequestDto,
  ): Promise<LoginResponseDto> {
    return this.userService.login(loginLocalRequest);
  }
}
