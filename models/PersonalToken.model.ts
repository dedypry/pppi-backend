import { Table } from 'decorators/objections';
import { Model } from '.';

@Table('personal_token')
export class PersonalTokenModel extends Model {
  token!: string;
  user_id!: number;
  exp!: string;
  ip?: string;
  browser?: string;
}
