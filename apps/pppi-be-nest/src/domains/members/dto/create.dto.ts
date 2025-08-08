import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsIn,
  IsDateString,
  IsNumber,
  IsBoolean,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class MemberCreateDto {
  @IsOptional()
  id?: number;

  @IsOptional()
  profile_id?: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  nik: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  front_title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  back_title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  place_birth: string;

  @IsDateString()
  date_birth: string;

  @IsIn(['male', 'female'])
  gender: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  citizenship: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @Type(() => Number)
  province_id: number;

  @IsNumber()
  @Type(() => Number)
  city_id: number;

  @IsNumber()
  @Type(() => Number)
  district_id: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  last_education_nursing: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  last_education?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  workplace: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  hope_in?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  contribution?: string;

  @IsBoolean()
  @Type(() => Boolean)
  is_member_payment: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  reason_reject?: string;

  @IsString()
  @IsNotEmpty()
  photo: string;

  @IsOptional()
  @IsString()
  member_payment_file?: string;

  @IsOptional()
  sort?: number;

  @IsOptional()
  join_year?: number;
}
