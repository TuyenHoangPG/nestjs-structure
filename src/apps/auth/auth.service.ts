import { UserService } from '@apps/user/user.service';
import { ConfigurationEnum } from '@configs/configurations.enum';
import { ConfigurationsService } from '@configs/configurations.service';
import { User } from '@entities/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { sign, SignOptions } from 'jsonwebtoken';
import { JwtPayload } from './dtos/requests/jwt-payload';
import { UserLoginRequest } from './dtos/requests/user-login.request.dto';
import { UserRegisterRequest } from './dtos/requests/user-register.request.dto';
import { UserRegisterDto } from './dtos/responses/user-register.response.dto';

@Injectable()
export class AuthService {
  private readonly jwtOptions: SignOptions;
  private readonly jwtKey: string;

  constructor(
    private readonly userService: UserService,
    private readonly configurationsService: ConfigurationsService,
  ) {
    this.jwtOptions = { expiresIn: '12h' };
    this.jwtKey = configurationsService.get(ConfigurationEnum.JWT_SECRET);
  }

  async registerUser(payload: UserRegisterRequest): Promise<UserRegisterDto> {
    const user = await this.userService.createUser(payload);
    const jwtPayload: JwtPayload = {
      userId: user.userId,
      role: user.role,
    };

    const token = await this.signPayload(jwtPayload);
    const userRegisterDto = new UserRegisterDto();
    userRegisterDto.token = token;
    userRegisterDto.email = user.email;
    userRegisterDto.firstName = user.firstName;
    userRegisterDto.lastName = user.lastName;
    userRegisterDto.userId = user.userId;

    return userRegisterDto;
  }

  async login(payload: UserLoginRequest): Promise<UserRegisterDto> {
    const { email, password } = payload;

    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new HttpException('Invalid email or password', HttpStatus.BAD_REQUEST);
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      throw new HttpException('Invalid email or password', HttpStatus.BAD_REQUEST);
    }

    const jwtPayload: JwtPayload = {
      userId: user.userId,
      role: user.role,
    };

    const token = await this.signPayload(jwtPayload);
    const userLoginDto = new UserRegisterDto();
    userLoginDto.token = token;
    userLoginDto.email = user.email;
    userLoginDto.firstName = user.firstName;
    userLoginDto.lastName = user.lastName;
    userLoginDto.userId = user.userId;

    return userLoginDto;
  }

  async signPayload(payload: JwtPayload): Promise<string> {
    return sign(payload, this.jwtKey, this.jwtOptions);
  }

  async validatePayload({ userId }: JwtPayload): Promise<User | null> {
    return this.userService.getUserById(userId);
  }
}
