import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { BannersService } from './banners.service';
import BannerCreateDto from './dto/create.dto';
import { AuthGuard } from 'guard/auth.guard';
import { PaginationDto } from 'utils/dto/pagination.dto';

@Controller('banners')
@UseGuards(AuthGuard)
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Get()
  list(@Query() query: PaginationDto) {
    query.page = query.page - 1;

    return this.bannersService.list(query);
  }

  @Post()
  create(@Body() body: BannerCreateDto) {
    return this.bannersService.create(body);
  }
}
