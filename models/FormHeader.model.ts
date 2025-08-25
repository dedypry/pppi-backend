import { Table } from 'decorators/objections';
import { Model } from '.';

@Table('form_headers')
export class FormHeaderModel extends Model {
  form_id: number;
  sort: number;
  key: string;
  title: string;
  type: string;
  options: any;
}
