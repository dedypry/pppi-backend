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
import { UpdateSettingDto } from './dto/update.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Controller('members')
export class MembersController {
  constructor(
    @InjectQueue('MAIL-QUEUE') private readonly queue: Queue,
    private readonly membersService: MembersService,
    private readonly pdfService: PdfService,
    private readonly excelService: ExcelService,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  list(@Query() query: PaginationDto) {
    query.page = query.page - 1;
    return this.membersService.list(query);
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
