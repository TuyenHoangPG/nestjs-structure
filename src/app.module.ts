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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
