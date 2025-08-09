import { BelongsToOne, HasMany, Table } from 'decorators/objections';
import { Model } from '.';
import { BlogCategoriesModel } from './BlogCategories.model';
import { UserModel } from './User.model';
import { BlogCommentsModel } from './BlogComments.model';

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

  @BelongsToOne(() => BlogCategoriesModel, {
    from: 'blogs.category_id',
    to: 'blog_categories.id',
  })
  category?: BlogCategoriesModel;

  @BelongsToOne(() => UserModel, {
    from: 'blogs.writer_id',
    to: 'users.id',
  })
  writer?: UserModel;

  @HasMany(() => BlogCommentsModel, {
    from: 'blogs.id',
    to: 'blog_comments.blog_id',
  })
  comments?: BlogCommentsModel[];
}
