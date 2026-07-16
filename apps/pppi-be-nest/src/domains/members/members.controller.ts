/* eslint-disable @typescript-eslint/no-floating-promises */
import {
  Body,
  Controller,
  Delete,
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
import { formatNia } from 'utils/services/user.service';

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

  @Get('filter-options')
  @UseGuards(AuthGuard)
  filterOptions() {
    return this.membersService.filterOptions();
  }

  @Get('kepengurusan/export')
  async kepengurusanExport(@Res() res: Response) {
    const rows = await this.membersService.kepengurusanExportRows();

    return this.excelJsService.download({
      name: `kepengurusan-${dayjs().format('YYYYMMDD-HHmmss')}`,
      headers: [
        { header: 'Wilayah', key: 'wilayah', width: 28 },
        { header: 'Pengurus', key: 'pengurus', width: 28 },
        { header: 'Jabatan', key: 'jabatan', width: 16 },
        { header: 'Nama', key: 'nama', width: 32 },
        { header: 'NIA', key: 'nia', width: 20, style: { numFmt: '@' } },
        { header: 'Email', key: 'email', width: 28 },
        { header: 'Phone', key: 'phone', width: 16 },
        { header: 'Status Verifikasi', key: 'verification_status', width: 18 },
        { header: 'Status Anggota', key: 'status', width: 14 },
      ],
      body: rows,
      res,
      worksheetFn: (worksheet) => {
        const niaCol = worksheet.getColumn('nia');
        if (niaCol) {
          niaCol.numFmt = '@';
          niaCol.eachCell({ includeEmpty: false }, (cell, rowNumber) => {
            if (rowNumber === 1) return;
            if (cell.value != null) {
              cell.value = String(cell.value);
              cell.numFmt = '@';
            }
          });
        }
      },
    });
  }

  @Get('kepengurusan/export-pdf')
  async kepengurusanExportPdf(@Res() res: Response) {
    const rows = await this.membersService.kepengurusanExportRows();
    const html = await getHtmlContent('kepengurusan', {
      rows: rows.map((row, index) => ({ ...row, no: index + 1 })),
      generated_at: dayjs().format('DD-MM-YYYY HH:mm'),
      total: rows.length,
    });

    await this.pdfService.downloadPdf({
      htmlContent: html,
      res,
      name: `kepengurusan-${dayjs().format('YYYYMMDD-HHmmss')}`,
      landscape: true,
    });
  }

  @Get('kepengurusan')
  kepengurusan() {
    return this.membersService.kepengurusanTree();
  }

  @Post('kepengurusan')
  @UseGuards(AuthGuard)
  createKepengurusan(
    @Body()
    body: {
      user_id: number;
      region: string;
      administrator_role: string;
      jabatan: string;
    },
  ) {
    return this.membersService.createKepengurusan(body);
  }

  @Patch('kepengurusan/replace')
  @UseGuards(AuthGuard)
  replaceKepengurusan(
    @Body()
    body: {
      from_user_id: number;
      to_user_id: number;
      region: string;
      administrator_role: string;
      jabatan: string;
    },
  ) {
    return this.membersService.replaceKepengurusan(body);
  }

  @Delete('kepengurusan/:userId')
  @UseGuards(AuthGuard)
  removeKepengurusan(@Param('userId') userId: number) {
    return this.membersService.removeKepengurusan(Number(userId));
  }

  @Get('export')
  @UseGuards(AuthGuard)
  async export(@Res() res: Response, @Query() query: PaginationDto) {
    const members = await this.membersService.listForExport(query);

    const allHeaders = [
      { header: 'ID', key: 'id', width: 8 },
      { header: 'NIA', key: 'nia', width: 20, style: { numFmt: '@' } },
      { header: 'Gelar Depan', key: 'front_title', width: 14 },
      { header: 'Nama', key: 'name', width: 28 },
      { header: 'Gelar Belakang', key: 'back_title', width: 14 },
      { header: 'Email', key: 'email', width: 28 },
      { header: 'Tahun Bergabung', key: 'join_year', width: 14 },
      { header: 'Jabatan', key: 'job_title', width: 18 },
      { header: 'Pengurus', key: 'administrator_role', width: 28 },
      { header: 'Wilayah', key: 'region', width: 36 },
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

    const selectedKeys = (query.fields || '')
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);
    const headerMap = new Map(allHeaders.map((h) => [h.key, h]));
    const headers =
      selectedKeys.length > 0
        ? selectedKeys
            .map((key) => headerMap.get(key))
            .filter(Boolean)
        : allHeaders;

    const parseJobTitle = (raw?: string) => {
      if (!raw) return '';
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.filter(Boolean).join(', ');
        }
      } catch {
        // plain string
      }
      return raw;
    };

    const body = members.map((user: any) => {
      const row: Record<string, any> = {
        id: user.id,
        nia: formatNia(user?.nia != null ? String(user.nia) : '') || '',
        front_title: user.front_title || '',
        name: user.name || '',
        back_title: user.back_title || '',
        email: user.email || '',
        join_year: user.join_year || '',
        job_title: parseJobTitle(user.job_title),
        administrator_role: user.administrator_role || '',
        region: user.region || '',
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
      };

      if (selectedKeys.length === 0) return row;

      return Object.fromEntries(
        selectedKeys.filter((k) => k in row).map((k) => [k, row[k]]),
      );
    });

    return this.excelJsService.download({
      name: `members-${dayjs().format('YYYYMMDD-HHmmss')}`,
      headers: headers as any,
      body,
      res,
      worksheetFn: (worksheet) => {
        const niaCol = worksheet.getColumn('nia');
        if (niaCol) {
          niaCol.numFmt = '@';
          niaCol.eachCell({ includeEmpty: false }, (cell, rowNumber) => {
            if (rowNumber === 1) return;
            if (cell.value != null) {
              cell.value = String(cell.value);
              cell.numFmt = '@';
            }
          });
        }
      },
    });
  }

  @Patch('settings/:id')
  @UseGuards(AuthGuard)
  memberSetting(@Param('id') id: number, @Body() body: UpdateSettingDto) {
    return this.membersService.memberSetting(body, id);
  }

  @Post('renew-nia')
  @UseGuards(AuthGuard)
  renewNiaBulk(@Body() body: { ids: number[] }) {
    return this.membersService.renewNiaBulk(body.ids || []);
  }

  @Patch(':id/renew-nia')
  @UseGuards(AuthGuard)
  renewNia(@Param('id') id: number) {
    return this.membersService.renewNia(id);
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
