import { Table } from 'decorators/objections';
import { Model } from '.';

@Table('blog_comments')
export class BlogCommentsModel extends Model {
  parent_id?: number;
  blog_id: number;
  user_id?: number;
  content: string;
  name?: string;
  email?: string;
  website?: string;
}
