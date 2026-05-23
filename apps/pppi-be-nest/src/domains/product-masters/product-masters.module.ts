import { Module } from '@nestjs/common';
import { ProductMastersController } from './product-masters.controller';
import { ProductMastersService } from './product-masters.service';

@Module({
  controllers: [ProductMastersController],
  providers: [ProductMastersService],
})
export class ProductMastersModule {}
