import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ItemDto {
  @IsInt()
  @Type(() => Number)
  product_id: number;

  @IsInt()
  @Type(() => Number)
  @Min(1)
  qty: number;
}

export class CreateShopOrderDto {
  @IsString()
  customer_name: string;

  @IsString()
  @IsEmail()
  customer_email: string;

  @IsString()
  customer_phone: string;

  @IsString()
  shipping_address: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  items: ItemDto[];
}
