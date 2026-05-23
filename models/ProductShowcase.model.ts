import { Table } from 'decorators/objections';
import { Model } from '.';

@Table('product_showcases')
export class ProductShowcaseModel extends Model {
  name: string;
  description?: string;
  is_active: boolean;
}
