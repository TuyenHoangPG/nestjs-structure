import { IPagination } from '@core/base.repository';
import { User } from '@entities/user.entity';
import { Injectable } from '@nestjs/common';
import { omit } from 'lodash';
import { ViewListUserRequest } from './dtos/requests/view-list-user.request.dto';
import { UserResponseDto } from './dtos/responses/user.response.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getList(payload: ViewListUserRequest): Promise<IPagination<UserResponseDto>> {
    const result = await this.userRepository.getList(payload);
    const listUserDto: UserResponseDto[] = result.items.map((user) => ({
      ...omit(user, ['password']),
      displayName: `${user.firstName} ${user.lastName}`,
    }));

    return {
      ...result,
      items: listUserDto,
    };
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async getUserById(userId: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: {
        userId,
      },
    });
  }

  async createUser({
    firstName,
    lastName,
    email,
    password,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<UserResponseDto> {
    const user = await this.userRepository.create({
      firstName,
      lastName,
      email,
      password,
    });

    return this._mapEntityToDto(user);
  }

  private _mapEntityToDto(user: User): UserResponseDto {
    const userDto = new UserResponseDto();
    userDto.displayName = `${user.firstName} ${user.lastName}`;
    Object.assign(userDto, user);

    return userDto;
  }
}
