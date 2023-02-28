import { ApiProperty } from '@nestjs/swagger';

export class UserRegisterDto {
  @ApiProperty() userId: string;
  @ApiProperty() firstName: string;
  @ApiProperty() lastName: string;
  @ApiProperty() email: string;
  @ApiProperty() token: string;
}
