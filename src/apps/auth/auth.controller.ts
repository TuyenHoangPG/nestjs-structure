import { UserService } from '@apps/user/user.service';
import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ApiException } from 'src/commons/interfaces/api-exception';
import { AuthService } from './auth.service';
import { UserLoginRequest } from './dtos/requests/user-login.request.dto';
import { UserRegisterRequest } from './dtos/requests/user-register.request.dto';
import { UserRegisterDto } from './dtos/responses/user-register.response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

  @Post('register')
  @ApiResponse({ status: HttpStatus.CREATED, type: UserRegisterDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  async register(@Body() body: UserRegisterRequest) {
    const { email } = body;
    const userExisted = await this.userService.getUserByEmail(email);

    if (userExisted) {
      throw new HttpException('This email is already exist!', HttpStatus.BAD_REQUEST);
    }

    const newUser = await this.authService.registerUser(body);
    return newUser;
  }

  @Post('login')
  @ApiResponse({ status: HttpStatus.OK, type: UserRegisterDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  async login(@Body() body: UserLoginRequest): Promise<UserRegisterDto> {
    return await this.authService.login(body);
  }
}
