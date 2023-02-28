import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UserLoginRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(125)
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
