import { Table } from 'decorators/objections';
import { Model } from '.';

@Table('role_permission')
export class RolePermissionModel extends Model {
  role_id!: number;
  permission_id!: number;
  read!: boolean;
  update!: boolean;
  create!: boolean;
  delete!: boolean;
}
