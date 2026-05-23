import { IsEmail, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePackageInterestDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  package_id?: number;

  @IsString()
  package_group: string;

  @IsString()
  package_title: string;

  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  institution?: string;

  @IsOptional()
  @IsString()
  note?: string;
}
