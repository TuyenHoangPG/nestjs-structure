import { Module, Global } from '@nestjs/common';
import { ConfigurationsService } from './configurations.service';
import { DatabaseConfigurations } from './database-configurations.service';

@Global()
@Module({
  providers: [ConfigurationsService, DatabaseConfigurations],
  exports: [ConfigurationsService, DatabaseConfigurations],
})
export class ConfigurationsModule {}
