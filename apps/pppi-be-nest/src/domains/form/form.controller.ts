import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FormService } from './form.service';
import {
  CreateFormDto,
  SubmitFormResultDto,
  UpdateFormStatus,
} from './dto/create.dto';
import { AuthGuard } from 'guard/auth.guard';
import { PaginationDto } from 'utils/dto/pagination.dto';
import { ExcelJsService } from 'utils/services/exceljs.service';
import { Response } from 'express';

@Controller('form')
export class FormController {
  constructor(
    private readonly formService: FormService,
    private readonly excelService: ExcelJsService,
  ) {}
  @Get()
  @UseGuards(AuthGuard)
  list(@Query() query: PaginationDto, @Req() req: any) {
    return this.formService.list(query, req['user']);
  }

  @Get('export/:id')
  @UseGuards(AuthGuard)
  async export(@Res() res: Response, @Param('id') id: number, @Req() req: any) {
    const form = await this.formService.detailResult(id.toString());

    if (!form) throw new NotFoundException('Form tidak ditemukan');

    const headers = [
      ...(form.member_required
        ? [
            { header: 'NIA', key: 'nia' },
            { header: 'Name', key: 'name' },
          ]
        : []),
      ...form.form_headers.map((header: any) => ({
        header: header.title,
        key: header.key,
      })),
    ];

    return this.excelService.download({
      name: form.title,
      headers,
      body: form.form_results.map((e) =>
        form.member_required
          ? {
              ...(e.value as any),
              nia: e.nia,
              name: e.name,
            }
          : (e.value as any),
      ),
      res: res,
    });
  }

  @Get(':slug')
  detail(@Param('slug') slug: string) {
    return this.formService.detail(slug);
  }
  @Get('member/:slug')
  detailMember(@Param('slug') slug: string) {
    return this.formService.detail(slug, 'member');
  }

  @Get('result/:slug')
  detailResult(@Param('slug') slug: string) {
    return this.formService.detailResult(slug);
  }

  @Post()
  @UseGuards(AuthGuard)
  createForm(@Body() body: CreateFormDto, @Req() req: any) {
    return this.formService.create(body, req['user']);
  }

  @Post('result')
  createResult(@Body() body: SubmitFormResultDto) {
    return this.formService.formResult(body);
  }

  @Delete('header/:id')
  formResultDestroy(@Param('id') id: number) {
    return this.formService.formResultDelete(id);
  }

  @Delete(':id')
  destroy(@Param('id') id: number) {
    return this.formService.destroy(id);
  }

  @Patch('status/:id')
  updateStatus(@Param('id') id: number, @Body() body: UpdateFormStatus) {
    return this.formService.updateStatus(body, id);
  }
}
