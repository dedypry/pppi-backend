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

  @Patch(':id/assign-user')
  @UseGuards(AuthGuard)
  assignUser(@Param('id') id: number, @Body() body: { user_id: number }) {
    return this.organizationsService.assignUser(id, Number(body.user_id));
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  destroy(@Param('id') id: number) {
    return this.organizationsService.destroy(id);
  }
}
