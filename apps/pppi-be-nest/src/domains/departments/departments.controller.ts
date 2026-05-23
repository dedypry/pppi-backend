import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { AuthGuard } from 'guard/auth.guard';
import { DepartmentCreateDto } from './dto/create.dto';

@Controller('departments')
@UseGuards(AuthGuard)
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  list() {
    return this.departmentsService.list();
  }

  @Post()
  createAndUpdate(@Body() body: DepartmentCreateDto) {
    return this.departmentsService.create(body);
  }

  @Delete(':id')
  destroy(@Param('id') id: number) {
    return this.departmentsService.destroy(id);
  }
}
