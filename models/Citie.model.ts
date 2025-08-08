import { Table } from 'decorators/objections';
import { Model } from '.';

@Table('cities')
export class CityModel extends Model {
  name!: string;
  code!: number;
  province_id!: number;
}
