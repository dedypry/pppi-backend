import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { AppsService } from './apps.service';
import { AppsUpdateDto } from './dto/apps.dto';

@Controller('apps')
export class AppsController {
  constructor(private readonly appsService: AppsService) {}

  @Get()
  getApp(@Query('key') key: string) {
    console.log('APP', key);
    return this.appsService.list(key);
  }

  @Patch(':key')
  updateApps(@Param('key') key: string, @Body() body: AppsUpdateDto) {
    return this.appsService.updateData(body, key);
  }
}
