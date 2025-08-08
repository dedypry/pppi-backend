import { Table } from 'decorators/objections';
import { Model } from '.';

@Table('districts')
export class DistrictModel extends Model {
  name!: string;
  code?: number;
  city_id!: number;
}
