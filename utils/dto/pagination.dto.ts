import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : 0))
  page: number;

  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : 10))
  pageSize: number;

  @IsOptional()
  @IsString()
  q?: string;

  status?: string;

  type?: string;
}
