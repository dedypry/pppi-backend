import { HasMany, Table } from 'decorators/objections';
import { Model } from '.';
import { FormHeaderModel } from './FormHeader.model';
import { FormResultModel } from './FormResult.model';

@Table('forms')
export class FormModel extends Model {
  title: string;
  slug: string;
  description: string;
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
}
