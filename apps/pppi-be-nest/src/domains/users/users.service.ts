import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserModel } from 'models/User.model';
import CheckEmailDto from './dto/check-mail.dto';
import { ProfileModel } from 'models/Profile.model';
import { PaginationDto } from 'utils/dto/pagination.dto';
import UpdateUserSettingDto from './dto/update-setting.dto';
import { hashPassword } from 'utils/helpers/bcrypt';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { fn } from 'objection';
import {
  ApproveVerificationDto,
  SendEmailVerificationDto,
  VerifyEmailSubmitDto,
} from './dto/email-verification.dto';
import { sign } from 'utils/helpers/jwt';
import { PersonalTokenModel } from 'models/PersonalToken.model';
import * as dayjs from 'dayjs';
import { DistrictModel } from 'models/District.model';
import { FileModel } from 'models/File.model';

@Injectable()
export class UsersService {
  constructor(@InjectQueue('AUTH-QUEUE') private readonly authQueue: Queue) {}

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
      .page(query.page || 0, query.pageSize || 10);
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

  private async resolveTokenUser(token: string) {
    if (!token) throw new BadRequestException('Token tidak valid');

    const personalToken = await PersonalTokenModel.query().findOne(
      'token',
      token,
    );

    if (!personalToken) {
      throw new UnauthorizedException(
        'Link verifikasi tidak valid atau sudah dipakai',
      );
    }

    if (personalToken.exp && new Date(personalToken.exp) < new Date()) {
      throw new UnauthorizedException('Link verifikasi sudah kadaluarsa');
    }

    const user = await UserModel.query()
      .modify('list')
      .withGraphFetched('[profile.[province, city, district]]')
      .findById(personalToken.user_id);

    if (!user) throw new NotFoundException('User tidak ditemukan');

    return { user, personalToken };
  }

  async getVerifyData(token: string) {
    const { user } = await this.resolveTokenUser(token);
    return user;
  }

  async sendEmailVerification(body: SendEmailVerificationDto) {
    const ids = (body.ids || []).map(Number).filter(Boolean);

    if (!ids.length) {
      throw new BadRequestException('Pilih minimal satu anggota');
    }

    const users = await UserModel.query()
      .whereIn('id', ids)
      .whereNotNull('email');

    if (!users.length) {
      throw new NotFoundException('User tidak ditemukan');
    }

    for (const user of users) {
      const token = sign({
        id: user.id,
        email: user.email,
        name: user.name,
      });

      await PersonalTokenModel.query().insert({
        user_id: user.id,
        token: token,
        exp: dayjs().add(365, 'day').toDate().toISOString(),
      });

      await user.$query().patch({
        verification_status:
          body.resend || user.verification_status ? 're_verified' : 'pending',
        is_need_verify: true,
        is_verified: false,
        ...(body.note !== undefined && { verification_note: body.note || null }),
      });

      await this.authQueue.add('send-email-verification', {
        userId: user.id,
        token,
      });
    }

    return `Email verifikasi dikirim ke ${users.length} anggota`;
  }

  async submitVerification(body: VerifyEmailSubmitDto) {
    const { user } = await this.resolveTokenUser(body.token);

    const regional: any = await DistrictModel.query()
      .select(
        'districts.id as district_id',
        'city.id as city_id',
        'province.id as province_id',
      )
      .findOne('districts.id', body.district_id)
      .join('cities as city', 'city.id', 'districts.city_id')
      .join('provinces as province', 'province.id', 'city.province_id');

    if (!regional) {
      throw new BadRequestException('Wilayah tidak valid');
    }

    await UserModel.query().upsertGraphAndFetch({
      id: user.id,
      email: body.email,
      name: body.name,
      sort: body?.sort || user.sort || null,
      join_year: body.join_year || user.join_year,
      front_title: body.front_title,
      back_title: body.back_title,
      verification_status: 'submitted',
      is_need_verify: true,
      is_verified: false,
      profile: {
        id: body.profile_id || user.profile?.id,
        nik: body.nik,
        place_birth: body.place_birth,
        date_birth: body.date_birth,
        gender: body.gender,
        citizenship: body.citizenship.toLocaleLowerCase(),
        address: body.address,
        province_id: regional.province_id,
        city_id: regional.city_id,
        district_id: regional.district_id,
        phone: body.phone,
        last_education_nursing: body.last_education_nursing,
        last_education: body.last_education,
        workplace: body.workplace,
        hope_in: body.hope_in,
        contribution: body.contribution,
        is_member_payment: body.is_member_payment,
        member_payment_file: body.member_payment_file,
        reason_reject: body.reason_reject,
        photo: body.photo,
      },
    } as any);

    await FileModel.query()
      .whereIn('url', [body?.member_payment_file as string, body.photo])
      .update({
        parent_id: user.id,
      });

    return 'Data verifikasi berhasil dikirim, menunggu persetujuan admin';
  }

  async approveVerification(id: number, body: ApproveVerificationDto) {
    const user = await UserModel.query().findById(id);

    if (!user) throw new NotFoundException('User tidak ditemukan');

    if (body.approved) {
      await user.$query().patch({
        verification_status: 'approved',
        is_verified: true,
        is_need_verify: false,
        email_verified_at: fn.now() as any,
        verification_note: body.note || null,
      });

      await PersonalTokenModel.query().where('user_id', id).delete();

      return 'Verifikasi anggota berhasil disetujui';
    }

    if (!body.note?.trim()) {
      throw new BadRequestException('Catatan penolakan wajib diisi');
    }

    await user.$query().patch({
      verification_status: 'rejected',
      is_verified: false,
      is_need_verify: true,
      verification_note: body.note,
    });

    return 'Verifikasi anggota ditolak';
  }
}
