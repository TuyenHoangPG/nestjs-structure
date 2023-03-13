import { UserModule } from '@apps/user/user.module';
import { ConfigurationsModule } from '@configs/configurations.module';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategyService } from './strategies/jwt-strategy/jwt-strategy.service';
import { LocalStrategyService } from './strategies/local-strategy/local-strategy.service';

@Module({
  controllers: [AuthController],
  imports: [UserModule, ConfigurationsModule],
  providers: [AuthService, JwtStrategyService, LocalStrategyService],
})
export class AuthModule {}
