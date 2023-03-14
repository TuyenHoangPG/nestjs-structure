import { ConfigurationsModule } from '@configs/configurations.module';
import { Module } from '@nestjs/common';
import { SendMailService } from './send-mail.service';

@Module({
  imports: [ConfigurationsModule],
  providers: [SendMailService],
  exports: [SendMailService],
})
export class SendMailModule {}
