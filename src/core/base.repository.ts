import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class BaseRepository<T> {
  constructor(private readonly repository: Repository<T>) {}

  public async count(filter?: FindManyOptions<T>): Promise<number> {
    return await this.repository.count(filter);
  }

  public async create(entity: DeepPartial<T>): Promise<T> {
    const obj = this.repository.create(entity);
    return await this.repository.save(obj);
  }

  public async update(
    condition: string | string[] | FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
  ): Promise<UpdateResult> {
    return await this.repository.update(condition, partialEntity);
  }

  public async delete(condition: string | string[] | FindOptionsWhere<T>): Promise<DeleteResult> {
    return await this.repository.delete(condition);
  }

  public async findAll(filter?: FindManyOptions<T>): Promise<IPagination<T>> {
    const [items, total] = await this.repository.findAndCount(filter);
    return {
      items,
      total,
    };
  }

  public async findOne(filter: FindOneOptions<T>) {
    return await this.repository.findOne(filter);
  }
}

export interface IPagination<T> {
  items: T[];
  readonly total: number;
}
