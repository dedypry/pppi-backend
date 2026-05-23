import { Module } from '@nestjs/common';
import { PackageInterestsController } from './package-interests.controller';
import { PackageInterestsService } from './package-interests.service';

@Module({
  controllers: [PackageInterestsController],
  providers: [PackageInterestsService],
})
export class PackageInterestsModule {}
