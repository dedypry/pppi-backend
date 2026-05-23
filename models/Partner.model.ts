import { Table } from 'decorators/objections';
import { Model } from '.';

@Table('partners')
export class PartnerModel extends Model {
  name: string;
  logo?: string;
  website?: string;
  description?: string;
}
