import { IsOptional, IsString } from 'class-validator';

export class AppsUpdateDto {
  @IsOptional()
  @IsString()
  logo: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  telp_1: string;

  @IsOptional()
  @IsString()
  telp_2?: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  short_title: string;
}
