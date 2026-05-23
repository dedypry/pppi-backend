import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProductCreateDto {
  @IsOptional()
  id?: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  price: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  stock: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  category_id?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  subcategory_id?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  showcase_id?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  uom_id?: number;

  @IsOptional()
  @IsString()
  rack_location?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  is_active?: boolean;
}
