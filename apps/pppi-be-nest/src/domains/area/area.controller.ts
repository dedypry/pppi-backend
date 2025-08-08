import { Controller, Get, Param } from '@nestjs/common';
import { AreaService } from './area.service';

@Controller()
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @Get('provinces')
  province() {
    return this.areaService.getProvince();
  }

  @Get('cities/:id')
  city(@Param('id') id: number) {
    return this.areaService.getCity(id);
  }

  @Get('districts/:id')
  district(@Param('id') id: number) {
    return this.areaService.getDistrict(id);
  }
}
