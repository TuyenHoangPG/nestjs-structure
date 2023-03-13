import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard, IAuthModuleOptions } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  getAuthenticateOptions(_context: ExecutionContext): IAuthModuleOptions {
    return {
      successReturnToOrRedirect: '/',
      failureRedirect: '/login-register',
    };
  }
}
