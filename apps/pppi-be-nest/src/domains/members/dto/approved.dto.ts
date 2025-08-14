import { IsBoolean, IsOptional, IsString } from 'class-validator';

export default class MemberApprovedDto {
  @IsBoolean()
  approved: boolean;

  @IsOptional()
  @IsString()
  rejected_note?: string;

  @IsOptional()
  @IsString()
  nia?: string;
}
