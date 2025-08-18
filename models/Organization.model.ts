import { BelongsToOne, HasMany, Modifier, Table } from 'decorators/objections';
import { Model } from '.';
import { UserModel } from './User.model';
import { AnyQueryBuilder } from 'objection';

@Table('organizations')
export class OrganizationModel extends Model {
  parent_id?: number;
  user_id: number;
  title: string;
  description: string;

  @Modifier
  child(query: AnyQueryBuilder) {
    query.withGraphFetched('children(child)').orderBy('created_at', 'desc');
  }

  @BelongsToOne(() => UserModel, {
    from: 'organizations.user_id',
    to: 'users.id',
  })
  user: UserModel;

  @HasMany(() => OrganizationModel, {
    from: 'organizations.id',
    to: 'organizations.parent_id',
  })
  children: OrganizationModel[];
}
