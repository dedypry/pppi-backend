import { Table } from 'decorators/objections';
import { Model } from '.';

@Table('uoms')
export class UomModel extends Model {
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
}
