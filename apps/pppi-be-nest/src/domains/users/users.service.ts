import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserModel } from 'models/User.model';
import CheckEmailDto from './dto/check-mail.dto';
import { fn } from 'objection';

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

    await user.$query().update({
      deleted_at: fn.now(),
      deleted_by: userId,
    });
  }
}
