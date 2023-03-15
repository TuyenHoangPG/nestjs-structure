import { IsNotEmpty, IsUUID } from 'class-validator';

export class VerifyAccountRequest {
  @IsNotEmpty()
  @IsUUID('4')
  verifyToken: string;
}
