import { Controller, Get } from '@nestjs/common';
import { BackgroundJobsService } from './background-jobs.service';

@Controller()
export class BackgroundJobsController {
  constructor(private readonly backgroundJobsService: BackgroundJobsService) {}

  @Get()
  getHello(): string {
    return this.backgroundJobsService.getHello();
  }
}
