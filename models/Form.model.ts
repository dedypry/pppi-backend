import { BelongsToOne, HasMany, Table } from 'decorators/objections';
import { Model } from '.';
import { FormHeaderModel } from './FormHeader.model';
import { FormResultModel } from './FormResult.model';
import { UserModel } from './User.model';

@Table('forms')
export class FormModel extends Model {
  title: string;
  slug: string;
  description: string;
  status: string;
  created_id: number;
  member_required: boolean;

  @HasMany(() => FormHeaderModel, {
    from: 'forms.id',
    to: 'form_headers.form_id',
  })
  form_headers: FormHeaderModel;

  @HasMany(() => FormResultModel, {
    from: 'forms.id',
    to: 'form_results.form_id',
  })
  form_results: FormResultModel;

  @BelongsToOne(() => UserModel, {
    from: 'forms.created_id',
    to: 'users.id',
  })
  created_by: UserModel;
}
