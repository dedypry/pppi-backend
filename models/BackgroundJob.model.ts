import { Table } from 'decorators/objections';
import { Model } from '.';

@Table('background_jobs')
export class BackgroundJobModel extends Model {
  status: string;
  data: any;
  error: any;
}
