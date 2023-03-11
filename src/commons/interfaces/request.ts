import { UserResponseDto } from '@apps/user/dtos/responses/user.response.dto';
import { Request } from 'express';

export interface IRequest extends Request {
  user?: UserResponseDto;
}
