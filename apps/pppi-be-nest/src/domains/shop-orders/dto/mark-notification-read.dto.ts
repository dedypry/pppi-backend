import { Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional } from 'class-validator';

export class MarkShopOrderNotificationReadDto {
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  ids?: number[];
}
