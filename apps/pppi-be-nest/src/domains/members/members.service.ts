/* eslint-disable @typescript-eslint/no-floating-promises */
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
import { fn, raw } from 'objection';
import { FileModel } from 'models/File.model';
import {
  formatNia,
  generateNia,
  normalizeNia,
} from 'utils/services/user.service';
import { IExportMember } from 'utils/interfaces/member.interface';
import { parseTempatTanggal } from 'utils/helpers/global';
import { customFormat, getYear, toIsoString } from 'utils/helpers/date-format';
import { BackgroundJobModel } from 'models/BackgroundJob.model';
import { UpdateSettingDto } from './dto/update.dto';
import { DistrictModel } from 'models/District.model';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class MembersService {
  constructor(@InjectQueue('MAIL-QUEUE') private readonly queue: Queue) {}

  private applyMemberFilters(query: PaginationDto) {
    return UserModel.query()
      .modify('list')
      .where((builder) => {
        if (query.q) {
          builder
            .whereILike('name', `%${query.q}%`)
            .orWhereILike('email', `%${query.q}%`)
            .orWhereILike('nia', `%${query.q}%`);
        }
      })
      .where((builder) => {
        if (query.status && query.status != 'all') {
          builder.where('status', query.status);
        }
      })
      .where((builder) => {
        if (
          query.verification_status &&
          query.verification_status !== 'all'
        ) {
          if (query.verification_status === 'not_sent') {
            builder.where((qb) => {
              qb.whereNull('verification_status').orWhere(
                'verification_status',
                '',
              );
            });
          } else {
            builder.where('verification_status', query.verification_status);
          }
        }
      })
      .where((builder) => {
        if (query.is_need_verify === 'yes') {
          builder.where('is_need_verify', true);
        }
        if (query.is_need_verify === 'no') {
          builder.where('is_need_verify', false);
        }
      })
      .where((builder) => {
        if (query.administrator_role && query.administrator_role !== 'all') {
          if (query.administrator_role === 'has_pengurus') {
            builder
              .whereNotNull('administrator_role')
              .whereNot('administrator_role', '');
          } else if (query.administrator_role === 'no_pengurus') {
            builder.where((qb) => {
              qb.whereNull('administrator_role').orWhere(
                'administrator_role',
                '',
              );
            });
          } else {
            builder.where('administrator_role', query.administrator_role);
          }
        }
      })
      .where((builder) => {
        if (query.region && query.region !== 'all') {
          builder.whereRaw(`SPLIT_PART(region, ' - ', 1) = ?`, [query.region]);
        }
      })
      .where((builder) => {
        if (query.jabatan && query.jabatan !== 'all') {
          // job_title may be JSON array string or plain text
          builder.where((qb) => {
            qb.where('job_title', query.jabatan!).orWhereRaw(
              `job_title ILIKE ?`,
              [`%"${query.jabatan}"%`],
            );
          });
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
      .orderBy('created_at', 'desc');
  }

  async list(query: PaginationDto) {
    return await this.applyMemberFilters(query).page(
      query.page || 0,
      query.pageSize || 10,
    );
  }

  async filterOptions() {
    const memberScope = () =>
      UserModel.query().whereExists(
        UserModel.relatedQuery('roles').where('title', 'member'),
      );

    const [roleRows, regionRows, jobTitleRows] = await Promise.all([
      memberScope()
        .distinct('administrator_role')
        .select('administrator_role')
        .whereNotNull('administrator_role')
        .whereNot('administrator_role', '')
        .orderBy('administrator_role', 'asc'),
      memberScope()
        .whereNotNull('region')
        .whereNot('region', '')
        .select(
          raw(`DISTINCT TRIM(SPLIT_PART(region, ' - ', 1)) as region_prefix`),
        )
        .orderBy('region_prefix', 'asc'),
      memberScope()
        .distinct('job_title')
        .select('job_title')
        .whereNotNull('job_title')
        .whereNot('job_title', ''),
    ]);

    const jabatanSet = new Set<string>();
    for (const row of jobTitleRows as Array<{ job_title?: string }>) {
      const jobTitle = row.job_title;
      if (!jobTitle) continue;
      try {
        const parsed = JSON.parse(jobTitle);
        if (Array.isArray(parsed)) {
          parsed.forEach((t) => {
            const val = String(t).trim();
            if (val) jabatanSet.add(val);
          });
          continue;
        }
      } catch {
        // plain string
      }
      const val = String(jobTitle).trim();
      if (val) jabatanSet.add(val);
    }

    return {
      administrator_roles: (roleRows as Array<{ administrator_role?: string }>)
        .map((r) => r.administrator_role)
        .filter(Boolean) as string[],
      regions: (regionRows as Array<{ region_prefix?: string }>)
        .map((r) => r.region_prefix)
        .filter(Boolean) as string[],
      jabatan: Array.from(jabatanSet).sort((a, b) => a.localeCompare(b)),
    };
  }

  async kepengurusanTree() {
    const users = await UserModel.query()
      .modify('list')
      .whereNotNull('administrator_role')
      .whereNot('administrator_role', '')
      .whereNotNull('region')
      .whereNot('region', '')
      .whereExists(UserModel.relatedQuery('roles').where('title', 'member'))
      .withGraphFetched('profile')
      .orderBy('name', 'asc');

    const pengurusOrder = ['DPN', 'DPD', 'DC', 'DPC', 'DPR'];
    const jabatanOrder = [
      'Ketua',
      'Wakil',
      'Sekertaris',
      'Sekretaris',
      'Bendahara',
      'Anggota',
    ];

    const parseJabatan = (raw?: string | null) => {
      if (!raw) return 'Anggota';
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed[0]) return String(parsed[0]);
      } catch {
        // plain
      }
      return String(raw);
    };

    const pengurusRank = (role: string) => {
      const code = role.split(' ')[0]?.replace(/[()]/g, '') || role;
      const idx = pengurusOrder.indexOf(code);
      return idx === -1 ? 99 : idx;
    };

    const jabatanRank = (jabatan: string) => {
      const idx = jabatanOrder.findIndex(
        (j) => j.toLowerCase() === jabatan.toLowerCase(),
      );
      return idx === -1 ? 99 : idx;
    };

    type Leaf = {
      id: string;
      title: string;
      type: 'user';
      wilayah: string;
      pengurus: string;
      region: string;
      user: any;
      children: never[];
    };
    type PengurusNode = {
      id: string;
      title: string;
      type: 'pengurus';
      children: Leaf[];
    };
    type WilayahNode = {
      id: string;
      title: string;
      type: 'wilayah';
      children: PengurusNode[];
    };

    const byWilayah = new Map<string, Map<string, Leaf[]>>();

    for (const user of users as any[]) {
      const wilayah = String(user.region || '')
        .split(' - ')[0]
        .trim();
      const pengurus = String(user.administrator_role || '').trim();
      if (!wilayah || !pengurus) continue;

      const jabatan = parseJabatan(user.job_title);
      if (!byWilayah.has(wilayah)) byWilayah.set(wilayah, new Map());
      const byPengurus = byWilayah.get(wilayah)!;
      if (!byPengurus.has(pengurus)) byPengurus.set(pengurus, []);

      byPengurus.get(pengurus)!.push({
        id: `user-${user.id}`,
        title: jabatan,
        type: 'user',
        wilayah,
        pengurus,
        region: String(user.region || ''),
        user,
        children: [],
      });
    }

    const tree: WilayahNode[] = [...byWilayah.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([wilayah, pengurusMap]) => ({
        id: `wilayah-${wilayah}`,
        title: wilayah,
        type: 'wilayah' as const,
        children: [...pengurusMap.entries()]
          .sort(([a], [b]) => pengurusRank(a) - pengurusRank(b))
          .map(([pengurus, leaves]) => ({
            id: `pengurus-${wilayah}-${pengurus}`,
            title: pengurus,
            type: 'pengurus' as const,
            children: leaves.sort(
              (a, b) => jabatanRank(a.title) - jabatanRank(b.title),
            ),
          })),
      }));

    return tree;
  }

  async replaceKepengurusan(body: {
    from_user_id: number;
    to_user_id: number;
    region: string;
    administrator_role: string;
    jabatan: string;
  }) {
    const fromId = Number(body.from_user_id);
    const toId = Number(body.to_user_id);

    if (!fromId || !toId) {
      throw new ForbiddenException('User asal dan tujuan wajib diisi');
    }
    if (!body.region || !body.administrator_role || !body.jabatan) {
      throw new ForbiddenException('Wilayah, pengurus, dan jabatan wajib diisi');
    }

    const [fromUser, toUser] = await Promise.all([
      UserModel.query().findById(fromId),
      UserModel.query().findById(toId),
    ]);

    if (!fromUser) throw new NotFoundException('User lama tidak ditemukan');
    if (!toUser) throw new NotFoundException('User baru tidak ditemukan');

    const jobTitle = JSON.stringify([String(body.jabatan).trim()]);

    await toUser.$query().patch({
      region: body.region,
      administrator_role: body.administrator_role,
      job_title: jobTitle,
    });

    if (fromId !== toId) {
      await fromUser.$query().patch({
        region: null as any,
        administrator_role: null as any,
        job_title: null as any,
      });
    }

    return 'Kepengurusan berhasil diganti';
  }

  private verificationLabel(status?: string | null) {
    switch (status) {
      case 'pending':
        return 'Email Terkirim';
      case 're_verified':
        return 'Re Verified';
      case 'submitted':
        return 'Menunggu Approve';
      case 'approved':
        return 'Terverifikasi';
      case 'rejected':
        return 'Ditolak';
      default:
        return 'Belum Dikirim';
    }
  }

  async kepengurusanExportRows() {
    const tree = await this.kepengurusanTree();
    const rows: Array<{
      wilayah: string;
      pengurus: string;
      jabatan: string;
      nama: string;
      nia: string;
      email: string;
      phone: string;
      verification_status: string;
      status: string;
    }> = [];

    for (const wilayah of tree) {
      for (const pengurus of wilayah.children || []) {
        for (const leaf of pengurus.children || []) {
          const user = leaf.user || {};
          const nama = [user.front_title, user.name, user.back_title]
            .filter(Boolean)
            .join(' ');

          rows.push({
            wilayah: wilayah.title,
            pengurus: pengurus.title,
            jabatan: leaf.title,
            nama,
            nia: formatNia(user?.nia != null ? String(user.nia) : '') || '',
            email: user.email || '',
            phone: user.profile?.phone || '',
            verification_status: this.verificationLabel(
              user.verification_status,
            ),
            status: user.status || '',
          });
        }
      }
    }

    return rows;
  }

  async listForExport(query: PaginationDto) {
    return await this.applyMemberFilters(query);
  }

  async detail(id: number) {
    return await UserModel.query()
      .modify('list')
      .withGraphFetched('[profile.[province, city, district], roles ]')
      .findById(id);
  }

  async create(body: MemberCreateDto) {
    const regional: any = await DistrictModel.query()
      .select(
        'districts.id as district_id',
        'city.id as city_id',
        'province.id as province_id',
      )
      .findOne('districts.id', body.district_id)
      .join('cities as city', 'city.id', 'districts.city_id')
      .join('provinces as province', 'province.id', 'city.province_id');

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
      ...(Array.isArray(body.job_titles)
        ? {
            job_title: JSON.stringify(
              body.job_titles.map((t) => String(t).trim()).filter(Boolean),
            ),
          }
        : {}),
      profile: {
        id: body.profile_id,
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
      nia = normalizeNia(body.nia);
      const checkNia = await UserModel.query().findOne('nia', nia);

      if (checkNia) {
        throw new ForbiddenException(
          `Nia Sudah Tersedia di user ${checkNia.name}`,
        );
      }
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

    if (body.approved) {
      this.queue.add('send-kta', { userId: id });
    }
    return 'Member berhasil di update';
  }

  async renewNia(id: number) {
    const member = await UserModel.query()
      .withGraphFetched('profile')
      .findById(id);

    if (!member) throw new NotFoundException('Member tidak ditemukan');
    if (member.status !== 'approved') {
      throw new ForbiddenException(
        'NIA hanya bisa diperbaharui untuk anggota yang sudah disetujui',
      );
    }
    if (!member.profile?.province_id || !member.profile?.city_id) {
      throw new ForbiddenException(
        'Provinsi dan kota anggota harus diisi terlebih dahulu',
      );
    }

    const generate = await generateNia({
      provinceId: member.profile.province_id,
      cityId: member.profile.city_id,
      dateBirth: member.profile.date_birth!,
      joinYear: Number(member.join_year),
    });

    const renewCount = Number(member.nia_renew_count || 0) + 1;

    await member.$query().update({
      nia: generate.nia,
      sort: generate.sort,
      nia_renew_count: renewCount,
    });

    return {
      message: `NIA berhasil diperbaharui menjadi ${formatNia(generate.nia)}`,
      nia: generate.nia,
      nia_formatted: formatNia(generate.nia),
      nia_renew_count: renewCount,
    };
  }

  async renewNiaBulk(ids: number[]) {
    const uniqueIds = [...new Set((ids || []).map(Number).filter(Boolean))];
    if (!uniqueIds.length) {
      throw new ForbiddenException('Pilih minimal 1 anggota');
    }

    let success = 0;
    const failed: Array<{ id: number; reason: string }> = [];

    for (const id of uniqueIds) {
      try {
        await this.renewNia(id);
        success += 1;
      } catch (err: any) {
        failed.push({
          id,
          reason: err?.message || 'Gagal memperbaharui NIA',
        });
      }
    }

    return {
      message: `NIA diperbaharui: ${success} berhasil${failed.length ? `, ${failed.length} gagal` : ''}`,
      success,
      failed,
    };
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
