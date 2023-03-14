import { IPagination } from '@core/base.repository';
import { User } from '@entities/user.entity';
import { Injectable } from '@nestjs/common';
import { omit } from 'lodash';
import { ViewListUserRequest } from './dtos/requests/view-list-user.request.dto';
import { UserResponseDto } from './dtos/responses/user.response.dto';
import { UserRepository } from './user.repository';
import { v4 } from 'uuid';
import { Repository } from 'typeorm';
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
    repository,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    repository?: Repository<User>;
  }): Promise<UserResponseDto> {
    const user = await (repository ?? this.userRepository).create({
      firstName,
      lastName,
      email,
      password,
      verifyToken: v4(),
    });

    if (repository) {
      await repository.save(user);
    }

    return this._mapEntityToDto(user);
  }

  private _mapEntityToDto(user: User): UserResponseDto {
    const userDto = new UserResponseDto();
    userDto.displayName = `${user.firstName} ${user.lastName}`;
    Object.assign(userDto, user);

    return userDto;
  }
}
