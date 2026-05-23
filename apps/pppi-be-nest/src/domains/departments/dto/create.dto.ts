import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class DepartmentCreateDto {
  @IsOptional()
  id?: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
