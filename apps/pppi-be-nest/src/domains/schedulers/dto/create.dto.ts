import { IsOptional, IsString } from 'class-validator';

export class ScheduleCreateDto {
  @IsOptional()
  id?: number;

  @IsString()
  cover: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsString()
  subtitle: string;

  @IsString()
  start_at: string;

  @IsOptional()
  @IsString()
  end_at?: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  price?: number;

  @IsOptional()
  discount?: number;

  @IsOptional()
  is_show_web?: boolean;
}
