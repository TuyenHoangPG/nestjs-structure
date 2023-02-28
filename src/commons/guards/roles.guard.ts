import { UserResponseDto } from '@apps/user/dtos/responses/user.response.dto';
import { UserRole } from '@constants/enum';
import { CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export class RolesGuard implements CanActivate {
  constructor(private readonly reflect: Reflector) {
    console.log('🚀 ~ file: roles.guard.ts:8 ~ RolesGuard ~ constructor ~ reflect:', reflect);
  }

  canActivate(context: ExecutionContext): boolean {
    console.log('🚀 ~ file: roles.guard.ts:8 ~ RolesGuard ~ constructor ~ reflect:', this.reflect);

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
