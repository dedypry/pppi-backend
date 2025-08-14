import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { AreaService } from './area.service';
import { PaginationDto } from 'utils/dto/pagination.dto';
import { UpdateProvinceCodeDto } from './dto/update.dto';

@Controller()
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @Get('provinces')
  province(@Query() query: PaginationDto) {
    return this.areaService.getProvince(query);
  }

  @Patch('provinces/:id')
  updateCode(@Body() body: UpdateProvinceCodeDto, @Param('id') id: number) {
    return this.areaService.updateProvinceCode(body, id);
  }

  @Get('cities')
  allCity(@Query() query: PaginationDto) {
    return this.areaService.getAllCity(query);
  }

  @Get('cities/:id')
  city(@Param('id') id: number) {
    return this.areaService.getCity(id);
  }

  @Patch('cities/:id')
  updateCityCode(@Body() body: UpdateProvinceCodeDto, @Param('id') id: number) {
    return this.areaService.updateCodeCity(body, id);
  }

  @Get('districts')
  allDistrict(@Query() query: PaginationDto) {
    if (query.type == 'merge') {
      return this.areaService.getAllDistricMerge();
    }

    return this.areaService.getAllDistrict(query);
  }

  @Patch('districts/:id')
  updateDistrictCode(
    @Body() body: UpdateProvinceCodeDto,
    @Param('id') id: number,
  ) {
    return this.areaService.updateCodeDistrict(body, id);
  }

  @Get('districts/:id')
  district(@Param('id') id: number) {
    return this.areaService.getDistrict(id);
  }
}
