import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @IsNumber({}, { message: 'Page must be a number' })
  @Transform(({ value }) => (value !== undefined ? Number(value) : 0))
  page: number;

  @IsOptional()
  @IsNumber({}, { message: 'Page size must be a number' })
  @Transform(({ value }) => (value !== undefined ? Number(value) : 10))
  pageSize: number;

  @IsOptional()
  @IsString()
  search?: string;
}
