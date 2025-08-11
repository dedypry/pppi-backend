import { HasOne, ManyToMany, Modifier, Table } from 'decorators/objections';
import { Model } from '.';
import { RoleModel } from './Role.model';
import { AnyQueryBuilder } from 'objection';
import { ProfileModel } from './Profile.model';
import { PersonalTokenModel } from './PersonalToken.model';

@Table()
export class UserModel extends Model {
  parent_id?: number;
  sort?: number;
  join_year?: string;
  front_title?: string;
  name?: string;
  back_title?: string;
  nia?: string;
  job_title?: string;
  email?: string;
  password?: string;
  email_verified_at?: string; // ISO timestamp format
  last_login?: string; // ISO timestamp format
  is_active?: boolean;
  is_organization?: boolean;
  status?: string;
  approved_at?: string; // ISO timestamp format
  approved_by?: number;
  rejected_at?: string; // ISO timestamp format
  rejected_by?: number;
  deleted_by?: number;
  rejected_note?: string;
  bio?: string;

  @Modifier
  list(query: AnyQueryBuilder) {
    query.select(
      'users.id',
      'name',
      'email',
      'join_year',
      'front_title',
      'back_title',
      'nia',
      'job_title',
      'last_login',
      'is_active',
      'is_organization',
      'status',
      'approved_at',
      'approved_by',
      'rejected_at',
      'rejected_by',
      'rejected_note',
      'sort',
      'created_at',
      'bio',
    );
  }

  @Modifier
  listBlog(query: AnyQueryBuilder) {
    query
      .select('users.id', 'name', 'email', 'bio')
      .withGraphFetched('profile(listProfile)')
      .modifiers({
        listProfile: (query: AnyQueryBuilder) => query.select('photo'),
      });
  }

  @ManyToMany(() => RoleModel, {
    from: 'users.id',
    to: 'roles.id',
    through: {
      from: 'role_user.user_id',
      to: 'role_user.role_id',
    },
  })
  roles!: RoleModel[];

  @HasOne(() => ProfileModel, {
    from: 'users.id',
    to: 'profiles.user_id',
  })
  profile!: ProfileModel;

  @HasOne(() => PersonalTokenModel, {
    from: 'users.id',
    to: 'personal_token.user_id',
  })
  personal_token!: PersonalTokenModel;
}
