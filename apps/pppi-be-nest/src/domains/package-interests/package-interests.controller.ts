import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PackageInterestsService } from './package-interests.service';
import { CreatePackageInterestDto } from './dto/create.dto';
import { PaginationDto } from 'utils/dto/pagination.dto';
import { AuthGuard } from 'guard/auth.guard';
import { UpdatePackageInterestStatusDto } from './dto/update-status.dto';

@Controller('package-interests')
export class PackageInterestsController {
  constructor(private readonly packageInterestsService: PackageInterestsService) {}

  @Post()
  create(@Body() body: CreatePackageInterestDto) {
    return this.packageInterestsService.create(body);
  }

  @Get()
  @UseGuards(AuthGuard)
  list(@Query() query: PaginationDto) {
    query.page = (query.page || 1) - 1;

    return this.packageInterestsService.list(query);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard)
  updateStatus(
    @Param('id') id: number,
    @Body() body: UpdatePackageInterestStatusDto,
  ) {
    return this.packageInterestsService.updateStatus(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  destroy(@Param('id') id: number) {
    return this.packageInterestsService.destroy(id);
  }
}
