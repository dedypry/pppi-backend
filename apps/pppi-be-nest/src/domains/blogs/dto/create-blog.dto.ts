import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum BlogStatus {
  PUBLISH = 'publish',
  DRAFT = 'draft',
  REJECT = 'rejected',
  SUBMISSION = 'submission',
}
export class BlogUpdateStatusDto {
  @IsEnum(BlogStatus, {
    message: 'Status must be one of: publish, draft, reject, submission',
  })
  status: BlogStatus;
}
export default class BlogCreateDto {
  @IsOptional()
  @IsNumber()
  id?: number;

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

  @IsOptional()
  @IsString()
  schedule?: string;
}
