import { ManyToMany, Modifier, Table } from 'decorators/objections';
import { Model } from '.';
import { AnyQueryBuilder, raw } from 'objection';
import { UserModel } from './User.model';
import { PermissionModel } from './Permission.model';
import { RoleUserModel } from './RoleUser.model';

@Table('roles')
export class RoleModel extends Model {
  title!: string;
  description?: string;
  slug!: string;

  @Modifier
  list(builder: AnyQueryBuilder, options: { userLimit?: number } = {}) {
    builder
      .select(
        'roles.id',
        'title',
        raw('coalesce(ru.total,0)::INT').as('total_user'),
        raw('ARRAY[]::TEXT[]').as('avatars'),
      )
      .withGraphFetched('permissions(listPermission)')
      .leftJoin(
        RoleUserModel.query()
          .select(raw('COUNT(*) as total'), 'role_id')
          .groupBy('role_id')
          .as('ru'),
        'ru.role_id',
        'roles.id',
      )
      .modifiers({
        listUser: (query: AnyQueryBuilder) =>
          query
            .select('users.id', 'name', 'email')
            .limit(options.userLimit ?? 3),
        listPermission: (query: AnyQueryBuilder) =>
          query.select(
            'permissions.id',
            'permissions.title',
            'role_permission.read',
            'role_permission.update',
            'role_permission.create',
            'role_permission.delete',
          ),
      });
  }

  @ManyToMany(() => UserModel, {
    from: 'roles.id',
    to: 'users.id',
    through: {
      from: 'role_user.role_id',
      to: 'role_user.user_id',
    },
  })
  users!: UserModel[];

  @ManyToMany(() => PermissionModel, {
    from: 'roles.id',
    to: 'permissions.id',
    through: {
      to: 'role_permission.permission_id',
      from: 'role_permission.role_id',
    },
  })
  permissions!: PermissionModel[];
}
