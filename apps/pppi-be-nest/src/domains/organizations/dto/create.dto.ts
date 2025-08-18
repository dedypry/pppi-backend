import { IsOptional, IsString } from 'class-validator';

export class OrganitationCreateDto {
  @IsOptional()
  id?: number;

  @IsOptional()
  user_id: number;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  parent_id: string;

  @IsOptional()
  @IsString()
  description: string;
}
