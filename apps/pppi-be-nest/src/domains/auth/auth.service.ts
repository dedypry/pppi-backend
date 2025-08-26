/* eslint-disable @typescript-eslint/no-floating-promises */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import LoginDto, { ForgotPasswordDto, ResetPasswordDto } from './dto/login.dto';
import { UserModel } from 'models/User.model';
import { comparePassword, hashPassword } from 'utils/helpers/bcrypt';
import { fn } from 'objection';
import { PersonalTokenModel } from 'models/PersonalToken.model';
import { sign } from 'utils/helpers/jwt';
import * as dayjs from 'dayjs';
import { generateRandomString } from 'utils/helpers/global';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class AuthService {
  constructor(
    private readonly mailService: MailerService,
    @InjectQueue('AUTH-QUEUE') private readonly queue: Queue,
  ) {}
  async login(body: LoginDto) {
    let user: any = null;

    if (body.type == 'admin') {
      user = await UserModel.query()
        .joinRelated('roles')
        .where('email', body.email)
        .whereIn('roles.title', ['admin', 'super-admin'])
        .first();

      if (!user) throw new NotFoundException('User Not Found');
    } else if (body.type == 'member') {
      user = await UserModel.query()
        .joinRelated('roles')
        .where('email', body.email)
        .whereIn('roles.title', ['member'])
        .first();

      if (!user) throw new NotFoundException('User Not Found');
    } else {
      throw new ForbiddenException();
    }

    const match = comparePassword(body.password, user?.password);

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

  async forgotPassword(body: ForgotPasswordDto) {
    const user = await UserModel.query()
      .where('email', body.email)
      .orWhere('nia', body.email)
      .first();

    if (!user) throw new NotFoundException('Email tidak ditemukan');

    await user.$query().update({
      token: generateRandomString(8),
      token_at: fn.now(),
    });

    this.queue.add('forgot-password', { userId: user.id });

    return `Kami sudah mengirim ke Email ${user.email}, Silahkan cek untuk reset password`;
  }

  async resetPassword(body: ResetPasswordDto) {
    const user = await UserModel.query().findOne('token', body.token);

    if (!user) throw new NotFoundException();

    await user.$query().update({
      token: null,
      token_at: null,
      password: hashPassword(body.new_password),
    });
    return 'Password Berhasil di reset';
  }
}
