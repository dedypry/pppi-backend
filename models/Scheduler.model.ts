import { BelongsToOne, Modifier, Table } from 'decorators/objections';
import { Model } from '.';
import { UserModel } from './User.model';
import { AnyQueryBuilder } from 'objection';

@Table('schedulers')
export class SchedulerModel extends Model {
  cover: string;
  title: string;
  slug: string;
  subtitle: string;
  color: string;
  start_at: string;
  end_at: string;
  description?: string;
  user_id: number;

  @Modifier
  list(query: AnyQueryBuilder) {
    query.select(
      'id',
      'title',
      'subtitle',
      'color',
      'start_at as start',
      'end_at as end',
      //   raw("TO_CHAR(start_at, 'YYYY-MM-DD') as start"),
      //   raw("TO_CHAR(end_at, 'YYYY-MM-DD') as end"),
      'description',
    );
  }

  @BelongsToOne(() => UserModel, {
    from: 'schedulers.user_id',
    to: 'users.id',
  })
  created_by: UserModel;
}
