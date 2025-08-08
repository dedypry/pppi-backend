import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export default class CheckEmailDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsNumber()
  user_id?: number;
}
