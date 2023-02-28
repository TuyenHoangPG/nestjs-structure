import { AuthService } from '@apps/auth/auth.service';
import { JwtPayload } from '@apps/auth/dtos/requests/jwt-payload';
import { ConfigurationEnum } from '@configs/configurations.enum';
import { ConfigurationsService } from '@configs/configurations.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';

@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService, private readonly configurationService: ConfigurationsService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configurationService.get(ConfigurationEnum.JWT_SECRET),
    });
  }

  async validate(payload: JwtPayload, done: VerifiedCallback) {
    console.log('🚀 ~ file: jwt-strategy.service.ts:19 ~ JwtStrategyService ~ validate ~ payload:', payload);
    const user = await this.authService.validatePayload(payload);
    console.log('🚀 ~ file: jwt-strategy.service.ts:21 ~ JwtStrategyService ~ validate ~ user:', user);

    if (!user) {
      return done(new HttpException({}, HttpStatus.UNAUTHORIZED), false);
    }

    return done(null, user, payload.iat);
  }
}
