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
  UseGuards,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { MemberCreateDto } from './dto/create.dto';
import { PaginationDto } from 'utils/dto/pagination.dto';
import MemberApprovedDto from './dto/approved.dto';
import { AuthGuard } from 'guard/auth.guard';
import { PdfService } from 'utils/services/pdf.service';
import { Response } from 'express';
import { getHtmlContent } from '../../services/html-contect';

@Controller('members')
@UseGuards(AuthGuard)
export class MembersController {
  constructor(
    private readonly membersService: MembersService,
    private readonly pdfService: PdfService,
  ) {}

  @Get()
  list(@Query() query: PaginationDto) {
    return this.membersService.list(query);
  }

  @Get(':id')
  detail(@Param('id') id: number) {
    return this.membersService.detail(id);
  }

  @Post()
  create(@Body() body: MemberCreateDto) {
    return this.membersService.create(body);
  }

  @Patch(':id')
  approved(
    @Param('id') id: number,
    @Body() body: MemberApprovedDto,
    @Req() req: any,
  ) {
    return this.membersService.updateApproved(body, id, req['user']['id']);
  }

  @Get('download/:id')
  async downloadPDF(@Res() res: Response, @Param('id') id: number) {
    const user = await this.membersService.detail(id);
    console.log('USER', user);

    const html = await getHtmlContent('kta', { ...user });

    console.log('HTML', html);

    await this.pdfService.downloadPdf({
      htmlContent: html,
      res,
      name: 'pdf of',
      landscape: true,
    });
  }
}
