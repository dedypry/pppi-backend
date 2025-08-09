import { IsArray } from 'class-validator';

export class BannerDeleteDto {
  @IsArray()
  ids: number[];
}
export default class BannerCreateDto {
  @IsArray()
  urls!: string[];
}
