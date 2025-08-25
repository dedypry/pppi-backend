import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FormService } from './form.service';
import { CreateFormDto, SubmitFormResultDto } from './dto/create.dto';
import { AuthGuard } from 'guard/auth.guard';
import { PaginationDto } from 'utils/dto/pagination.dto';

@Controller('form')
export class FormController {
  constructor(private readonly formService: FormService) {}
  @Get()
  list(@Query() query: PaginationDto) {
    return this.formService.list(query);
  }

  @Get(':slug')
  detail(@Param('slug') slug: string) {
    return this.formService.detail(slug);
  }

  @Get('result/:slug')
  detailResult(@Param('slug') slug: string) {
    return this.formService.detailResult(slug);
  }

  @Post()
  @UseGuards(AuthGuard)
  createForm(@Body() body: CreateFormDto) {
    return this.formService.create(body);
  }

  @Post('result')
  createResult(@Body() body: SubmitFormResultDto) {
    return this.formService.formResult(body);
  }

  @Delete(':id')
  destroy(@Param('id') id: number) {
    return this.formService.destroy(id);
  }
}
