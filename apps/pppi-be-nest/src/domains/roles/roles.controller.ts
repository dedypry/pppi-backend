import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import RoleCreateDto from './dto/create.dto';
import { PaginationDto } from 'utils/dto/pagination.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  list(@Query() query: PaginationDto) {
    query.page = query.page - 1;
    return this.rolesService.list(query);
  }

  @Post()
  createOrUpdate(@Body() body: RoleCreateDto) {
    return this.rolesService.create(body);
  }

  @Delete(':id')
  destroy(@Param('id') id: number) {
    return this.rolesService.destroy(id);
  }
}
