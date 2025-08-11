import { HasMany, Modifier, Table } from 'decorators/objections';
import { Model } from '.';
import { AnyQueryBuilder } from 'objection';

@Table('blog_comments')
export class BlogCommentsModel extends Model {
  parent_id?: number;
  blog_id: number;
  user_id?: number;
  content: string;
  name?: string;
  email?: string;
  website?: string;
  avatar?: string;

  @Modifier
  child(query: AnyQueryBuilder) {
    query.withGraphFetched('children(child)').orderBy('created_at', 'desc');
  }

  @HasMany(() => BlogCommentsModel, {
    from: 'blog_comments.id',
    to: 'blog_comments.parent_id',
  })
  children: BlogCommentsModel[];
}
