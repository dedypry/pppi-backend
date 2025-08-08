import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class BlogCategoryCreateDto {
  @IsOptional()
  id?: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsBoolean()
  is_active: boolean;
}
