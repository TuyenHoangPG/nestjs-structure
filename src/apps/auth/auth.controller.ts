import { UserService } from '@apps/user/user.service';
import { REGISTER_SUCCESS } from '@constants/constants';
import { LocalAuthGuard } from '@guards/local-auth.guard';
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Response,
  Redirect,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ApiException, RedirectingException } from 'src/commons/interfaces/api-exception';
import { ICustomRequest } from 'src/commons/interfaces/request';
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
    const { email, password, passwordConfirmation } = body;
    if (password !== passwordConfirmation) {
      throw new HttpException('Confirm password is not match!', HttpStatus.BAD_REQUEST);
    }

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

  @UseGuards(LocalAuthGuard)
  @Post('login-local')
  @Redirect('/')
  async loginLocal() {
    return;
  }

  @Post('register-local')
  @Redirect('/login-register')
  async registerLocal(@Request() request: ICustomRequest, @Body() body: UserRegisterRequest) {
    const { email, password, passwordConfirmation } = body;
    if (password !== passwordConfirmation) {
      throw new RedirectingException('/login-register', 'Confirm password is not match!');
    }

    const userExisted = await this.userService.getUserByEmail(email);

    if (userExisted) {
      throw new RedirectingException('/login-register', 'This email is already exist!');
    }

    const errors = await this.authService.registerUserLocal(body, request);
    if (errors.length) {
      request.flash('errors', errors);
    } else {
      request.flash('success', REGISTER_SUCCESS(email));
    }
  }
}
