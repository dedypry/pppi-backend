import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BlogCategoryStatusDto {
  @IsBoolean()
  status: boolean;
}
export default class BlogCategoryCreateDto {
  @IsOptional()
  id?: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsBoolean()
  is_active: boolean;
}
