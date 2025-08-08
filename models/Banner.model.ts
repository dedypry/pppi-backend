import { Table } from 'decorators/objections';
import { Model } from '.';

@Table('banners')
export class BannerModel extends Model {
  url!: string;
  is_active!: boolean;
}
