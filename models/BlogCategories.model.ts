import { Table } from 'decorators/objections';
import { Model } from '.';

@Table('blog_categories')
export class BlogCategoriesModel extends Model {
  name: string;
  icon?: string;
  is_active: boolean;
}
