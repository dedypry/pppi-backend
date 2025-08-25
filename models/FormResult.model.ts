import { BelongsToOne, Table } from 'decorators/objections';
import { Model } from '.';
import { UserModel } from './User.model';

@Table('form_results')
export class FormResultModel extends Model {
  form_id: number;
  nia: string;
  name: string;
  email: string;
  value: string;

  @BelongsToOne(() => UserModel, {
    from: 'form_results.nia',
    to: 'users.nia',
  })
  user: UserModel;
}
