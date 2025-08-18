import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganitationCreateDto } from './dto/create.dto';
import { AuthGuard } from 'guard/auth.guard';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  list() {
    return this.organizationsService.list();
  }

  @Post()
  @UseGuards(AuthGuard)
  createAndUpdate(@Body() body: OrganitationCreateDto) {
    return this.organizationsService.create(body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  destroy(@Param('id') id: number) {
    return this.organizationsService.destroy(id);
  }
}
