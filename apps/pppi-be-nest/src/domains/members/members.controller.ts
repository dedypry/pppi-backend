/* eslint-disable @typescript-eslint/no-floating-promises */
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { MemberCreateDto } from './dto/create.dto';
import { PaginationDto } from 'utils/dto/pagination.dto';
import MemberApprovedDto from './dto/approved.dto';
import { AuthGuard } from 'guard/auth.guard';
import { PdfService } from 'utils/services/pdf.service';
import { Response } from 'express';
import { getHtmlContent } from '../../services/html-contect';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelService } from 'utils/services/excel.service';
import { ExcelJsService } from 'utils/services/exceljs.service';
import { UpdateSettingDto } from './dto/update.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import * as dayjs from 'dayjs';

@Controller('members')
export class MembersController {
  constructor(
    @InjectQueue('MAIL-QUEUE') private readonly queue: Queue,
    private readonly membersService: MembersService,
    private readonly pdfService: PdfService,
    private readonly excelService: ExcelService,
    private readonly excelJsService: ExcelJsService,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  list(@Query() query: PaginationDto) {
    query.page = query?.page ? query.page - 1 : 0;
    return this.membersService.list(query);
  }

  @Get('export')
  @UseGuards(AuthGuard)
  async export(@Res() res: Response, @Query() query: PaginationDto) {
    const members = await this.membersService.listForExport(query);

    const headers = [
      { header: 'ID', key: 'id', width: 8 },
      { header: 'NIA', key: 'nia', width: 18 },
      { header: 'Gelar Depan', key: 'front_title', width: 14 },
      { header: 'Nama', key: 'name', width: 28 },
      { header: 'Gelar Belakang', key: 'back_title', width: 14 },
      { header: 'Email', key: 'email', width: 28 },
      { header: 'Tahun Bergabung', key: 'join_year', width: 14 },
      { header: 'Job Title', key: 'job_title', width: 18 },
      { header: 'Status', key: 'status', width: 14 },
      { header: 'Aktif', key: 'is_active', width: 10 },
      { header: 'Butuh Verifikasi', key: 'is_need_verify', width: 16 },
      { header: 'Sudah Verifikasi', key: 'is_verified', width: 16 },
      { header: 'Status Verifikasi', key: 'verification_status', width: 18 },
      { header: 'Catatan Verifikasi', key: 'verification_note', width: 30 },
      { header: 'NIK', key: 'nik', width: 20 },
      { header: 'Tempat Lahir', key: 'place_birth', width: 18 },
      { header: 'Tanggal Lahir', key: 'date_birth', width: 16 },
      { header: 'Gender', key: 'gender', width: 10 },
      { header: 'Kewarganegaraan', key: 'citizenship', width: 14 },
      { header: 'Telepon', key: 'phone', width: 16 },
      { header: 'Alamat', key: 'address', width: 40 },
      { header: 'Provinsi', key: 'province', width: 20 },
      { header: 'Kota', key: 'city', width: 20 },
      { header: 'Kabupaten/Kecamatan', key: 'district', width: 22 },
      {
        header: 'Pendidikan Keperawatan',
        key: 'last_education_nursing',
        width: 20,
      },
      { header: 'Pendidikan Formal', key: 'last_education', width: 20 },
      { header: 'Tempat Kerja', key: 'workplace', width: 28 },
      { header: 'Harapan', key: 'hope_in', width: 30 },
      { header: 'Kontribusi', key: 'contribution', width: 30 },
      { header: 'Bersedia Bayar', key: 'is_member_payment', width: 14 },
      { header: 'Alasan Tidak Bersedia', key: 'reason_reject', width: 28 },
      { header: 'Foto', key: 'photo', width: 40 },
      { header: 'Bukti Pembayaran', key: 'member_payment_file', width: 40 },
      { header: 'Approved At', key: 'approved_at', width: 18 },
      { header: 'Rejected At', key: 'rejected_at', width: 18 },
      { header: 'Rejected Note', key: 'rejected_note', width: 28 },
      { header: 'Created At', key: 'created_at', width: 18 },
    ];

    const body = members.map((user: any) => ({
      id: user.id,
      nia: user.nia || '',
      front_title: user.front_title || '',
      name: user.name || '',
      back_title: user.back_title || '',
      email: user.email || '',
      join_year: user.join_year || '',
      job_title: (() => {
        const raw = user.job_title || '';
        if (!raw) return '';
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            return parsed.filter(Boolean).join(', ');
          }
        } catch {
          // plain string (legacy)
        }
        return raw;
      })(),
      status: user.status || '',
      is_active: user.is_active ? 'Ya' : 'Tidak',
      is_need_verify: user.is_need_verify ? 'Ya' : 'Tidak',
      is_verified: user.is_verified ? 'Ya' : 'Tidak',
      verification_status: user.verification_status || '',
      verification_note: user.verification_note || '',
      nik: user.profile?.nik || '',
      place_birth: user.profile?.place_birth || '',
      date_birth: user.profile?.date_birth
        ? dayjs(user.profile.date_birth).format('DD-MM-YYYY')
        : '',
      gender: user.profile?.gender || '',
      citizenship: user.profile?.citizenship || '',
      phone: user.profile?.phone || '',
      address: user.profile?.address || '',
      province: user.profile?.province?.name || '',
      city: user.profile?.city?.name || '',
      district: user.profile?.district?.name || '',
      last_education_nursing: user.profile?.last_education_nursing || '',
      last_education: user.profile?.last_education || '',
      workplace: user.profile?.workplace || '',
      hope_in: user.profile?.hope_in || '',
      contribution: user.profile?.contribution || '',
      is_member_payment: user.profile?.is_member_payment ? 'Ya' : 'Tidak',
      reason_reject: user.profile?.reason_reject || '',
      photo: user.profile?.photo || '',
      member_payment_file: user.profile?.member_payment_file || '',
      approved_at: user.approved_at
        ? dayjs(user.approved_at).format('DD-MM-YYYY HH:mm')
        : '',
      rejected_at: user.rejected_at
        ? dayjs(user.rejected_at).format('DD-MM-YYYY HH:mm')
        : '',
      rejected_note: user.rejected_note || '',
      created_at: user.created_at
        ? dayjs(user.created_at).format('DD-MM-YYYY HH:mm')
        : '',
    }));

    return this.excelJsService.download({
      name: `members-${dayjs().format('YYYYMMDD-HHmmss')}`,
      headers,
      body,
      res,
    });
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  detail(@Param('id') id: number) {
    return this.membersService.detail(id);
  }

  @Post()
  create(@Body() body: MemberCreateDto) {
    return this.membersService.create(body);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  approved(
    @Param('id') id: number,
    @Body() body: MemberApprovedDto,
    @Req() req: any,
  ) {
    return this.membersService.updateApproved(body, id, req['user']['id']);
  }
  @Patch('settings/:id')
  @UseGuards(AuthGuard)
  memberSetting(@Param('id') id: number, @Body() body: UpdateSettingDto) {
    return this.membersService.memberSetting(body, id);
  }

  @Get('download/:id')
  @UseGuards(AuthGuard)
  async downloadPDF(@Res() res: Response, @Param('id') id: number) {
    const user = await this.membersService.detail(id);

    const html = await getHtmlContent('kta', { ...user });

    await this.pdfService.downloadPdf({
      htmlContent: html,
      res,
      name: 'pdf of',
      landscape: true,
    });
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFileExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file) return 'No File';

    const result = this.excelService.parseExcel(file.buffer);

    return this.membersService.uploadBulkMemberFromExcel(result[0].rows as any);
  }

  @Post('send-mail/:id')
  @UseInterceptors(FileInterceptor('file'))
  sendMail(@Param('id') id: number) {
    this.queue.add('send-kta', { userId: id });

    return 'Email sudah di proses, dan akan dikirimkan beberapa saat lagi!!!';
  }
}
