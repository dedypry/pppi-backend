import { Table } from 'decorators/objections';
import { Model } from '.';

@Table('provinces')
export class ProvinceModel extends Model {
  name!: string;
  code?: number;
}
