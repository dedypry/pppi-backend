import { Table } from 'decorators/objections';
import { Model } from '.';

@Table('blogs')
export class BlogModel extends Model {
  category_id: number;
  writer_id: number;
  cover?: string;
  title: string;
  slug: string;
  subtitle: string;
  content: string;
  tags: string[]; // karena pakai text[]
  status: string;
  view_count: number;
  share_count: number;
  publish_at?: string; // ISO string dari datetime
  schedule?: string;
}
