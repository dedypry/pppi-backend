import { Table } from 'decorators/objections';
import { Model } from '.';

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
}
