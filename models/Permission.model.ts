import { ManyToMany, Table } from 'decorators/objections';
import { Model } from '.';
import { RoleModel } from './Role.model';

@Table('permissions')
export class PermissionModel extends Model {
  title!: string;
  core!: boolean;
  read!: boolean;
  update!: boolean;
  create!: boolean;
  delete!: boolean;
  created_by!: number;

  @ManyToMany(() => RoleModel, {
    from: 'permissions.id',
    to: 'roles.id',
    through: {
      to: 'role_permission.role_id',
      from: 'role_permission.permission_id',
    },
  })
  roles!: RoleModel[];
}
