import { DataSource } from 'typeorm';
import { ConfigurationEnum } from './configurations.enum';
import { ConfigurationsService } from './configurations.service';

class TypeORMConfigurations extends ConfigurationsService {
  get connectionSource() {
    return new DataSource({
      migrationsTableName: 'migrations',
      type: 'postgres',
      host: process.env[ConfigurationEnum.DB_HOST],
      port: Number(process.env[ConfigurationEnum.DB_PORT] || 5432),
      username: process.env[ConfigurationEnum.DB_USERNAME],
      password: process.env[ConfigurationEnum.DB_PASSWORD],
      database: process.env[ConfigurationEnum.DB_NAME],
      logging: false,
      synchronize: false,
      name: 'default',
      entities: ['src/databases/entities/**.entity{.ts,.js}'],
      migrations: ['src/databases/migrations/**/*{.ts,.js}'],
      subscribers: ['src/databases/subscriber/**/*{.ts,.js}'],
    });
  }
}

export default new TypeORMConfigurations().connectionSource;
