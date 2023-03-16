import { UserService } from '@apps/user/user.service';
import { REGISTER_SUCCESS } from '@constants/constants';
import { LocalAuthGuard } from '@guards/local-auth.guard';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Redirect,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ApiException, RedirectingException } from 'src/commons/interfaces/api-exception';
import { ICustomRequest } from 'src/commons/interfaces/request';
import { AuthService } from './auth.service';
import { UserLoginRequest } from './dtos/requests/user-login.request.dto';
import { UserRegisterRequest } from './dtos/requests/user-register.request.dto';
import { VerifyAccountRequest } from './dtos/requests/verify-account.request.dto';
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
  @Redirect('/home')
  async loginLocal(@Request() req: ICustomRequest) {
    req.flash('success', `Hello ${req.user?.displayName}. Have a good day!`);
  }

  @Post('register-local')
  @Redirect('/login-register')
  async registerLocal(@Request() req: ICustomRequest, @Body() body: UserRegisterRequest) {
    const { email, password, passwordConfirmation } = body;
    if (password !== passwordConfirmation) {
      throw new RedirectingException('/login-register', 'Confirm password is not match!');
    }

    const userExisted = await this.userService.getUserByEmail(email);

    if (userExisted) {
      throw new RedirectingException('/login-register', 'This email is already exist!');
    }

    const errors = await this.authService.registerUserLocal(body, req);
    if (errors.length) {
      req.flash('errors', errors);
    } else {
      req.flash('success', REGISTER_SUCCESS(email));
    }
  }

  @Get('verify/:verifyToken')
  @Redirect('/login-register')
  async verifyAccount(@Request() req: ICustomRequest, @Param() params: VerifyAccountRequest) {
    const { verifyToken } = params;
    const user = await this.userService.getUserByVerifyToken(verifyToken);

    if (!user) {
      throw new RedirectingException('/login-register', 'This link is not exist!');
    }

    await this.userService.verifyUserLocal(verifyToken);
    req.flash('success', 'Your account has been activated successfully. You can now log in to the app.');
  }
}
