import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PartnersService } from './partners.service';
import { PartnerCreateDto } from './dto/create.dto';
import { AuthGuard } from 'guard/auth.guard';

@Controller('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Get()
  list() {
    return this.partnersService.list();
  }

  @Post()
  @UseGuards(AuthGuard)
  createAndUpdate(@Body() body: PartnerCreateDto) {
    return this.partnersService.create(body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  destroy(@Param('id') id: number) {
    return this.partnersService.destroy(id);
  }
}
