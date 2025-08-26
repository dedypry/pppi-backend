import { IsEmail, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @IsString()
  @IsEmail()
  email!: string;
}

export class ResetPasswordDto {
  @IsString()
  new_password!: string;

  @IsString()
  confirm_password!: string;

  @IsString()
  token!: string;
}
export default class LoginDto {
  @IsString()
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsString()
  type!: string;
}
