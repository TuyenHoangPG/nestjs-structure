import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigurationEnum } from './configurations.enum';
import { ConfigurationsService } from './configurations.service';

@Injectable()
export class DatabaseConfigurations extends ConfigurationsService {
  static get config(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: process.env[ConfigurationEnum.DB_HOST],
      port: Number(process.env[ConfigurationEnum.DB_PORT] || 5432),
      username: process.env[ConfigurationEnum.DB_USERNAME],
      password: process.env[ConfigurationEnum.DB_PASSWORD],
      database: process.env[ConfigurationEnum.DB_NAME],
      entities: ['src/databases/entities/**.entity{.ts,.js}'],
      synchronize: false,
      logging: false,
    };
  }
}
