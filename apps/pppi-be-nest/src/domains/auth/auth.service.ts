import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import LoginDto from './dto/login.dto';
import { UserModel } from 'models/User.model';
import { comparePassword } from 'utils/helpers/bcrypt';
import { fn } from 'objection';
import { PersonalTokenModel } from 'models/PersonalToken.model';
import { sign } from 'utils/helpers/jwt';
import * as dayjs from 'dayjs';

@Injectable()
export class AuthService {
  async login(body: LoginDto) {
    const user = await UserModel.query().findOne('email', body.email);

    if (!user) throw new NotFoundException('User Not Found');

    const match = comparePassword(body.password, user.password);

    if (!match) throw new BadRequestException('Password Not Match');

    await user.$query().update({
      last_login: fn.now(),
    });

    const result = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    const token = sign(result);

    await PersonalTokenModel.query().insert({
      user_id: user.id,
      token: token,
      exp: dayjs().add(2, 'day').toDate().toISOString(),
    });

    return {
      ...result,
      token,
    };
  }

  async logout(token: string) {
    if (!token) throw new NotAcceptableException();

    const personalToken = await PersonalTokenModel.query().findOne(
      'token',
      token.replaceAll('Bearer ', ''),
    );

    if (!personalToken) {
      throw new NotFoundException('No User');
    }

    await personalToken.$query().delete();

    return 'Logout Success';
  }
}
