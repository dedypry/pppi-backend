import { IsArray, IsString } from 'class-validator';

export class UpdateSettingDto {
  @IsArray()
  roleId: string[];

  @IsString()
  password?: string;
}
