import { UserResponseDto } from '@apps/user/dtos/responses/user.response.dto';
import { Request } from 'express';

export interface ICustomRequest extends Request {
  user?: UserResponseDto;
  flash(): { [key: string]: string[] };
  flash(message: string): string[];
  flash(type: string, message: string[] | string): number;
  flash(type: string, format: string, ...args: any[]): number;
}
