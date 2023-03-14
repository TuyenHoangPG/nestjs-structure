import { UserRole } from '@constants/enum';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty() userId: string;
  @ApiProperty() firstName: string;
  @ApiProperty() lastName: string;
  @ApiProperty() displayName: string;
  @ApiProperty() email: string;
  @ApiProperty() verifyToken: string;
  @ApiProperty() role: UserRole;
}
