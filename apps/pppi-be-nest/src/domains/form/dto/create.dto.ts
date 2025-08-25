import { IsBoolean, IsString } from 'class-validator';

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
    options: {
      label: string;
    }[];
  }[];
}
