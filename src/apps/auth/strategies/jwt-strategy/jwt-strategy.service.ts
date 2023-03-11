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
    const user = await this.authService.validatePayload(payload);

    if (!user) {
      return done(new HttpException('Unauthorized!', HttpStatus.UNAUTHORIZED), false);
    }

    return done(null, user, payload.iat);
  }
}
