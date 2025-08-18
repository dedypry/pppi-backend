import { IsString } from 'class-validator';

export class PackageUpdateDto {
  id?: number;
  parent_id?: number;
  types?: string[];
  benefit: string[];
  description?: string;

  @IsString()
  title: string;
}
