import { IsString, Matches } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  front_title: string;

  @IsString()
  back_title: string;

  @IsString()
  nik: string;

  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  place_birth: string;

  @IsString()
  date_birth: string; // Bisa diganti Date kalau mau parsing ke objek Date

  @IsString()
  gender: 'male' | 'female';

  @IsString()
  citizenship: string;

  @IsString()
  address: string;

  @Matches(/^\d+$/, {
    message: 'province_id must be a number or numeric string',
  })
  province_id: number;

  @Matches(/^\d+$/, { message: 'city_id must be a number or numeric string' })
  city_id: number;

  @Matches(/^\d+$/, {
    message: 'district_id must be a number or numeric string',
  })
  district_id: number;
  @IsString()
  phone: string;

  @IsString()
  last_education_nursing: string;

  @IsString()
  last_education: string;

  @IsString()
  workplace: string;
}

export class UpdatePhotoProfileDto {
  @IsString()
  photo: string;
}

export class UpdatePasswordeDto {
  @IsString()
  password: string;

  @IsString()
  new_password: string;

  @IsString()
  confirm_password: string;
}
export class UpdateBioDto {
  @IsString()
  bio: string;
}
