import { Table } from 'decorators/objections';
import { Model } from '.';

@Table('files')
export class FileModel extends Model {
  name!: string;
  url!: string;
  size!: number;
  extension!: string;
  mime_type!: string;
  parent_id?: number;
  table?: string;
}
