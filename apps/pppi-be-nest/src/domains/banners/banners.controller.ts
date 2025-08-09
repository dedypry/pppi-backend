import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { BannersService } from './banners.service';
import BannerCreateDto, { BannerDeleteDto } from './dto/create.dto';
import { AuthGuard } from 'guard/auth.guard';

@Controller('banners')
@UseGuards(AuthGuard)
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Get()
  list() {
    return this.bannersService.list();
  }

  @Post()
  create(@Body() body: BannerCreateDto) {
    return this.bannersService.create(body);
  }

  @Delete()
  destroy(@Body() body: BannerDeleteDto) {
    return this.bannersService.destroy(body);
  }
}
