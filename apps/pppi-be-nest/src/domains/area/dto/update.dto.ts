import { IsNumber } from 'class-validator';

export class UpdateProvinceCodeDto {
  @IsNumber()
  code: string;
}
