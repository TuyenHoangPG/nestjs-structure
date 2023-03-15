import { AuthService } from '@apps/auth/auth.service';
import { User } from '@entities/user.entity';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { RedirectingException } from 'src/commons/interfaces/api-exception';

@Injectable()
export class LocalStrategyService extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<User> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new RedirectingException('/login-register', 'Invalid email or password');
    }
    return user;
  }
}
