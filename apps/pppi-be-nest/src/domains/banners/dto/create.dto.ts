import { IsString } from 'class-validator';

export default class BannerCreateDto {
  @IsString()
  url!: string;
}
