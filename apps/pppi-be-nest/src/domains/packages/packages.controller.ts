import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { PackageUpdateDto } from './dto/create.dto';

@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Get()
  list() {
    return this.packagesService.list();
  }

  @Post()
  createAndUpdate(@Body() body: PackageUpdateDto) {
    return this.packagesService.create(body);
  }

  @Delete(':id')
  destroy(@Param('id') id: number) {
    return this.packagesService.destroy(id);
  }
}
