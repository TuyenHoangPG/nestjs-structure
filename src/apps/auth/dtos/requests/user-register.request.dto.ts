import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UserRegisterRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(125)
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
