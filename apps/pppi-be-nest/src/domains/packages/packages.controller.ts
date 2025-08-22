import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PackagesService } from './packages.service';
import { PackageUpdateDto } from './dto/create.dto';
import { AuthGuard } from 'guard/auth.guard';

@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Get()
  list() {
    return this.packagesService.list();
  }

  @Post()
  @UseGuards(AuthGuard)
  createAndUpdate(@Body() body: PackageUpdateDto) {
    return this.packagesService.create(body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  destroy(@Param('id') id: number) {
    return this.packagesService.destroy(id);
  }
}
