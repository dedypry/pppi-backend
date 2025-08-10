import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SchedulersService } from './schedulers.service';
import { PaginationDto } from 'utils/dto/pagination.dto';
import { ScheduleCreateDto } from './dto/create.dto';
import { AuthGuard } from 'guard/auth.guard';

@Controller('schedulers')
export class SchedulersController {
  constructor(private readonly schedulersService: SchedulersService) {}

  @Get()
  list(@Query() query: PaginationDto) {
    query.page = query.page - 1;
    return this.schedulersService.list(query);
  }

  @Get(':slug')
  detail(@Param('slug') slug: string) {
    return this.schedulersService.detail(slug);
  }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() body: ScheduleCreateDto, @Req() req: any) {
    return this.schedulersService.create(body, req['user']['id']);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  destroy(@Param('id') id: number) {
    return this.schedulersService.destroy(id);
  }
}
