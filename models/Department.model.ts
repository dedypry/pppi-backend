import { Table } from 'decorators/objections';
import { Model } from '.';

@Table('departments')
export class DepartmentModel extends Model {
  name: string;
  code?: string;
  description?: string;
  is_active: boolean;
}
