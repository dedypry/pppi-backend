import { IsArray, IsOptional, IsString } from 'class-validator';

export default class RoleCreateDto {
  id?: number;

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description!: string;

  @IsOptional()
  @IsArray()
  user_id?: number[];
}
