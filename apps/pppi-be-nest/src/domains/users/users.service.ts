import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserModel } from 'models/User.model';
import CheckEmailDto from './dto/check-mail.dto';
import { fn } from 'objection';
import { ProfileModel } from 'models/Profile.model';
import { PaginationDto } from 'utils/dto/pagination.dto';
import UpdateUserSettingDto from './dto/update-setting.dto';
import { hashPassword } from 'utils/helpers/bcrypt';

@Injectable()
export class UsersService {
  async list(query: PaginationDto) {
    return await UserModel.query()
      .modify('list')
      .withGraphFetched('[roles, profile]')
      .where((builder) => {
        if (query.q) {
          builder
            .whereILike('users.name', `%${query.q}%`)
            .orWhereILike('users.email', `%${query.q}%`)
            .orWhereILike('users.nia', `%${query.q}%`);
        }
      })
      .orderBy('users.created_at', 'desc')
      .page(query.page, query.pageSize);
  }

  async checkEmail(body: CheckEmailDto) {
    let user = UserModel.query().findOne('email', body.email);

    if (body.user_id) {
      user = user.whereNot('id', body.user_id);
    }

    if (await user) {
      throw new ConflictException('Email sudah digunakan');
    }

    return true;
  }

  async destroy(id: number, userId: number) {
    const user = await UserModel.query().findById(id);

    if (!user) throw new NotFoundException();

    await ProfileModel.query().where('user_id', user.id).delete();

    await user.$relatedQuery('roles').unrelate();

    await user.$query().delete();

    console.log(userId);

    return 'User berhasil di hapus';
  }

  async userSetting(id: number, body: UpdateUserSettingDto) {
    const user = await UserModel.query().findById(id);

    if (!user) throw new NotFoundException();

    await user.$relatedQuery('roles').unrelate();
    if (body.roleId?.length) {
      await user.$relatedQuery('roles').relate(body.roleId);
    }

    if (body?.password) {
      await user.$query().update({
        password: hashPassword(body.password),
      });
    }

    if (typeof body?.is_active === 'boolean') {
      await user.$query().patch({
        is_active: body.is_active,
      });
    }

    return 'Pengaturan user berhasil diperbarui';
  }
}
