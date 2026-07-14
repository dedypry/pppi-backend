import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : 0))
  page?: number;

  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : 10))
  pageSize?: number;

  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => (value !== undefined ? Boolean(value) : false))
  noPagination?: boolean;

  status?: string;

  type?: string;
  user?: number | string;

  @IsOptional()
  @IsString()
  verification_status?: string;

  @IsOptional()
  @IsString()
  is_need_verify?: string;
}
