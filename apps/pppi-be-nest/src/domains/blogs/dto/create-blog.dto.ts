import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export default class BlogCreateDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsNumber()
  @IsNotEmpty()
  category_id: number;

  @IsString()
  cover?: string;

  @IsString()
  title: string;

  @IsString()
  subtitle: string;

  @IsString()
  content: string;

  @IsArray()
  tags: string[];

  @IsString()
  publish_at?: string;

  @IsOptional()
  @IsString()
  schedule?: string;
}
