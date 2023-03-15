import { SendMailModule } from '@apps/send-mail/send-mail.module';
import { UserModule } from '@apps/user/user.module';
import { ConfigurationsModule } from '@configs/configurations.module';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategyService } from './strategies/jwt-strategy/jwt-strategy.service';
import { LocalStrategyService } from './strategies/local-strategy/local-strategy.service';
import { SessionSerializer } from './strategies/local-strategy/session.serializer';

@Module({
  controllers: [AuthController],
  imports: [
    UserModule,
    ConfigurationsModule,
    SendMailModule,
    PassportModule.register({
      defaultStrategy: ['local', 'jwt'],
      session: true,
    }),
  ],
  providers: [AuthService, JwtStrategyService, LocalStrategyService, SessionSerializer],
})
export class AuthModule {}
