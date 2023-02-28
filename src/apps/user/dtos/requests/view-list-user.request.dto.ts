import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from 'class-validator';

export class ViewListUserRequest {
  @IsString()
  @IsOptional()
  search?: string;

  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsNotEmpty()
  @ValidateIf((obj) => obj.page)
  pageSize?: number;

  @IsDateString()
  @ValidateIf((obj) => obj.page)
  pageTimestamp: Date;
}
