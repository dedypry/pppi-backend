import { IsArray, IsBoolean } from 'class-validator';

export class BannerDeleteDto {
  @IsArray()
  ids: number[];
}
export class BannerUpdateStatusDto {
  @IsBoolean()
  status: boolean;
}
export default class BannerCreateDto {
  @IsArray()
  urls!: string[];
}
