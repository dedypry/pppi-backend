import { Table } from 'decorators/objections';
import { Model } from '.';

@Table('form_results')
export class FormResultModel extends Model {
  form_id: number;
  nia: string;
  name: string;
  email: string;
  value: string;
}
