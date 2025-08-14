import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { IExportMember } from 'utils/interfaces/member.interface';
import { parseTempatTanggal } from 'utils/helpers/global';
import { customFormat, getYear, toIsoString } from 'utils/helpers/date-format';
import { BackgroundJobModel } from 'models/BackgroundJob.model';
import { UpdateSettingDto } from './dto/update.dto';

@Injectable()
export class MembersService {
  async list(query: PaginationDto) {
    return await UserModel.query()
      .modify('list')
      .where((builder) => {
        if (query.q) {
          builder
            .whereILike('name', `%${query.q}%`)
            .orWhereILike('email', `%${query.q}%`)
            .orWhereILike('nia', `%${query.q}%`);
        }

        if (query.status && query.status != 'all') {
          builder.where('status', query.status);
        }
      })
      .modify((builder) => {
        if (query.q) {
          builder
            .joinRelated('profile')
            .orWhereILike('profile.phone', `%${query.q}%`);
        }
      })
      .withGraphFetched('[profile.[province, city, district] ]')
      .whereExists(UserModel.relatedQuery('roles').where('title', 'member'))
      .page(query.page, query.pageSize);
  }

  async detail(id: number) {
    return await UserModel.query()
      .modify('list')
      .withGraphFetched('[profile.[province, city, district], roles ]')
      .findById(id);
  }

  async create(body: MemberCreateDto) {
    const user: any = await UserModel.query().upsertGraphAndFetch({
      id: body.id,
      email: body.email,
      name: body.name,
      sort: body?.sort || null,
      join_year: body.join_year,
      ...(!body?.id && {
        status: 'submission',
        is_active: false,
        is_organization: false,
        password: hashPassword(dayjs(body.date_birth).format('DDMMYYYY')),
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
    const member = await UserModel.query()
      .withGraphFetched('profile')
      .findById(id);

    if (!member) throw new NotFoundException();
    let nia = '';
    if (body.nia) {
      const checkNia = await UserModel.query().findOne('nia', body.nia);

      if (checkNia) {
        throw new ForbiddenException(
          `Nia Sudah Tersedia di user ${checkNia.name}`,
        );
      }
      nia = body.nia;
    } else {
      if (body.approved) {
        const generate = await generateNia({
          provinceId: member.profile.province_id!,
          cityId: member.profile.city_id!,
          dateBirth: member.profile.date_birth!,
          sort: member.sort,
          joinYear: Number(member.join_year),
        });

        nia = generate.nia;
      }
    }

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

  async memberSetting(body: UpdateSettingDto, id: number) {
    const user = await UserModel.query().findById(id);

    if (!user) throw new NotFoundException();

    await user.$relatedQuery('roles').unrelate();
    for (const roleId of body.roleId) {
      await user.$relatedQuery('roles').relate(roleId);
    }

    if (body?.password) {
      console.log('MASUK ganti password');
      await user.$query().update({
        password: hashPassword(body.password),
      });
    }

    return 'Member berhasil di update';
  }

  async uploadBulkMemberFromExcel(data: IExportMember[]) {
    //drive.google.com/open?id=1r0vGnN38H_hGidApavBqa1Yboo1IMHGQ

    for (const item of data) {
      const parseTTL = parseTempatTanggal(item.tempattanggal_lahir);

      const paymentFile =
        item.jika_bersedia_dapat_dikirimkan_melalui_bri_kcp_jatinegara_norek_120601000397303_an_perkumpulan_perawat_pembaharuan_indonesia;

      const user = {
        front_title: '',
        back_title: '',
        join_year: getYear(item.timestamp),
        name: item.nama_lengkap_tanpa_gelar_gunakan_huruf_kapital_contoh_ani_roro_dewi,
        email: item.email_aktif,
        password: hashPassword(customFormat(parseTTL.tanggal)),
        is_active: false,
        status: 'submission',
      } as any;

      const profile = {
        gender: item.jenis_kelamin === 'Laki-laki' ? 'male' : 'female',
        date_birth: toIsoString(parseTTL.tanggal),
        place_birth: parseTTL.tempat!,
        citizenship: (item.kewarganegaraan || 'wni').toLowerCase(),
        phone: item.no_telpwa_aktif,
        last_education_nursing: item.pendidikan_terakhir_keperawatan,
        last_education: item.pendidikan_terakhir_selain_keperawatan_formal,
        is_member_payment:
          item.kontribusi_keanggotaan_sebesar_rp_100000_sebagai_anggota_baru ===
          'Bersedia',
        member_payment_file: this.converLink(paymentFile),
        workplace: item.instansiinstitusi_tempat_bekerja_saat_ini,
        hope_in: item.harapan_apa_yang_dapat_diberikan_oleh_organisasi_pppip3i,
        contribution:
          item.kontribusi_yang_diharapkan_dapat_diberikan_untuk_organisasi_pppip3i,
        nik: item.nomor_induk_kependudukan,
        reason_reject:
          item.alasan_tidak_bersedia_berkontribusi_sebagai_anggota_baru || '',
        address: item.alamat_tempat_tinggal_lengkap,
        photo: this.converLink(
          item.foto_terbaru_ukuran_4x6_dengan_background_warna_merah_472_x_709_px,
        ),
      };

      await BackgroundJobModel.query().insert({
        status: 'pending',
        data: {
          user,
          profile,
        },
        error: null,
      });
    }

    // return parseTTL
    // const file = await getImageFromUrl(url);
    return 'Job Berhasil di buat';
  }

  converLink(url: string) {
    if (!url) return null;
    const match = url.match(/id=([^&]+)/);
    const id = match ? match[1] : null;

    return `https://drive.google.com/file/d/${id}/view`;
  }
}
