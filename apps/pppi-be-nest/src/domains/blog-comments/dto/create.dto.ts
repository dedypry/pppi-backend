import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNumber()
  blog_id: number;

  @IsOptional()
  parent_id?: number;

  @IsString()
  content: string;

  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  website: string;

  avatar: string;
}
