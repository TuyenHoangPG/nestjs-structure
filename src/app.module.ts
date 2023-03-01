import { AuthModule } from '@apps/auth/auth.module';
import { UserModule } from '@apps/user/user.module';
import { ConfigurationEnum } from '@configs/configurations.enum';
import { ConfigurationsService } from '@configs/configurations.service';
import { DatabaseConfigurations } from '@configs/database-configurations.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigurationsModule } from './configurations/configurations.module';

@Module({
  imports: [
    ConfigurationsModule,
    TypeOrmModule.forRootAsync({
      useFactory: (): TypeOrmModuleOptions => DatabaseConfigurations.config,
      inject: [DatabaseConfigurations],
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static host: string;
  static port: number | string;
  static isDev: boolean;

  constructor(private readonly configurationService: ConfigurationsService) {
    AppModule.port = configurationService.get(ConfigurationEnum.PORT);
    AppModule.host = configurationService.get(ConfigurationEnum.HOST);
    AppModule.isDev = configurationService.isDevelopment;
  }
}
