import {
  IsArray,
  IsNotEmpty,
  IsString,
  ArrayMinSize,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { MemberCreateDto } from '../../members/dto/create.dto';

export class SendEmailVerificationDto {
  @IsArray()
  @ArrayMinSize(1)
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map((id) => Number(id)) : [],
  )
  ids: number[];

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  resend?: boolean;
}

export class VerifyEmailDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class VerifyEmailSubmitDto extends MemberCreateDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class ApproveVerificationDto {
  @IsBoolean()
  @Type(() => Boolean)
  approved: boolean;

  @IsOptional()
  @IsString()
  note?: string;
}
