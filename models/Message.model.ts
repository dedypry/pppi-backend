import { Table } from 'decorators/objections';
import { Model } from '.';

@Table('messages')
export class MessageModel extends Model {
  name: string;
  email: string;
  subject: string;
  content: string;
}
