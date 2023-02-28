import { UserRole } from '@constants/enum';

export interface JwtPayload {
  userId: string;
  role: UserRole;
  iat?: Date;
}
