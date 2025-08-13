import { Module } from '@nestjs/common';
import { BackgroundJobsController } from './background-jobs.controller';
import { BackgroundJobsService } from './background-jobs.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [BackgroundJobsController],
  providers: [BackgroundJobsService],
})
export class BackgroundJobsModule {}
