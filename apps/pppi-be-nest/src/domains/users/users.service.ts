import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserModel } from 'models/User.model';
import CheckEmailDto from './dto/check-mail.dto';
import { fn } from 'objection';
import { ProfileModel } from 'models/Profile.model';

@Injectable()
export class UsersService {
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
}
