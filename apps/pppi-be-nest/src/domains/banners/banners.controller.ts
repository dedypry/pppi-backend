import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BannersService } from './banners.service';
import BannerCreateDto, {
  BannerDeleteDto,
  BannerUpdateStatusDto,
} from './dto/create.dto';
import { AuthGuard } from 'guard/auth.guard';

@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Get()
  list() {
    return this.bannersService.list();
  }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() body: BannerCreateDto) {
    return this.bannersService.create(body);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  updateStatus(@Param('id') id: number, @Body() body: BannerUpdateStatusDto) {
    return this.bannersService.updateStatus(id, body);
  }

  @Delete()
  @UseGuards(AuthGuard)
  destroy(@Body() body: BannerDeleteDto) {
    return this.bannersService.destroy(body);
  }
}
