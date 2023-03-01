import { UserResponseDto } from '@apps/user/dtos/responses/user.response.dto';
import { UserRole } from '@constants/enum';
import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflect: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflect.get<UserRole[]>('roles', context.getHandler());
    if (!roles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: UserResponseDto = request.user;
    if (roles.some((role) => user?.role === role)) {
      return true;
    }

    throw new HttpException('You do not have permission!', HttpStatus.FORBIDDEN);
  }
}
