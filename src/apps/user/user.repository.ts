import { BaseRepository } from '@core/base.repository';
import { User } from 'src/databases/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Like, Repository } from 'typeorm';
import { ViewListUserRequest } from './dtos/requests/view-list-user.request.dto';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(
    @InjectRepository(User)
    userRepository: Repository<User>,

    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    super(userRepository);
  }

  async getList(payload: ViewListUserRequest) {
    return await this.findAll({
      take: payload.pageSize || 10,
      skip: payload.page && payload?.pageSize ? payload?.page * payload?.pageSize : 0,
      where: payload.search
        ? [
            {
              firstName: Like(`%${payload.search}%`),
            },
            {
              lastName: Like(`%${payload.search}%`),
            },
          ]
        : undefined,
    });
  }
}
