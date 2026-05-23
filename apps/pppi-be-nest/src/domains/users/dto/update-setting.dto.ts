import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export default class UpdateUserSettingDto {
  @IsArray()
  roleId: string[];

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
