import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFormDto {
  id?: number;

  @IsString()
  title: string;

  @IsBoolean()
  member_required: boolean;

  @IsString()
  description: string;

  form_headers: {
    id?: number;
    title: string;
    type: string;
    sort: number;
    required: boolean;
    options: {
      label: string;
    }[];
  }[];
}

export class SubmitFormResultDto {
  @IsNotEmpty()
  form_id: number;

  @IsOptional()
  @IsString()
  nia: string;
  name: string;
  email: string;

  @IsNotEmpty()
  value: string;
}
