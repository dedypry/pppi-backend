import { Injectable, NotFoundException } from '@nestjs/common';
import { MemberCreateDto } from './dto/create.dto';
import { UserModel } from 'models/User.model';
import * as dayjs from 'dayjs';
import { hashPassword } from 'utils/helpers/bcrypt';
import { PaginationDto } from 'utils/dto/pagination.dto';
import { RoleModel } from 'models/Role.model';
import MemberApprovedDto from './dto/approved.dto';
import { fn } from 'objection';
import { FileModel } from 'models/File.model';
import { generateNia } from 'utils/services/user.service';

@Injectable()
export class MembersService {
  async list(query: PaginationDto) {
    return await UserModel.query()
      .modify('list')
      .whereNull('deleted_at')
      .withGraphFetched('[profile.[province, city, district] ]')
      .whereExists(UserModel.relatedQuery('roles').where('title', 'member'))
      .page(query.page, query.pageSize);
  }

  async detail(id: number) {
    return await UserModel.query()
      .modify('list')
      .withGraphFetched('[profile.[province, city, district] ]')
      .findById(id);
  }

  async create(body: MemberCreateDto) {
    const user: any = await UserModel.query().upsertGraphAndFetch({
      id: body.id,
      email: body.email,
      name: body.name,
      sort: body?.sort,
      join_year: body.join_year,
      ...(!body?.id && {
        status: 'submission',
        is_active: false,
        is_organization: false,
        password: hashPassword(dayjs(body.date_birth).format('ddmmYYYY')),
      }),
      front_title: body.front_title,
      back_title: body.back_title,
      profile: {
        id: body.profile_id,
        nik: body.nik,
        place_birth: body.place_birth,
        date_birth: body.date_birth,
        gender: body.gender,
        citizenship: body.citizenship.toLocaleLowerCase(),
        address: body.address,
        province_id: body.province_id,
        city_id: body.city_id,
        district_id: body.district_id,
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

    if (!body.id) {
      const role = await RoleModel.query().findOne('title', 'member');
      await role?.$relatedQuery('users').relate(user.id);
    }

    await FileModel.query()
      .whereIn('url', [body?.member_payment_file as string, body.photo])
      .update({
        parent_id: user.id,
      });

    return `Member berhasil ${body.id ? 'diperbaharui' : 'ditambahkan'}`;
  }

  async updateApproved(body: MemberApprovedDto, id: number, userId: number) {
    const member = await UserModel.query().findById(id);

    if (!member) throw new NotFoundException();

    const { nia } = await generateNia({
      provinceId: member.profile.province_id!,
      cityId: member.profile.city_id!,
      dateBirth: member.profile.date_birth!,
      sort: member.sort,
      joinYear: Number(member.join_year),
    });

    const status = body.approved ? 'approved' : 'rejected';

    await member.$query().update({
      status: status,
      ...(body.approved
        ? {
            approved_at: fn.now(),
            approved_by: userId,
            is_active: true,
            nia,
          }
        : {
            rejected_note: body?.rejected_note,
            rejected_at: fn.now(),
            rejected_by: userId,
          }),
    });

    return 'Member berhasil di update';
  }
}
