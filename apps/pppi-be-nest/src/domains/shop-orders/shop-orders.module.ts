import { Module } from '@nestjs/common';
import { ShopOrdersController } from './shop-orders.controller';
import { ShopOrdersService } from './shop-orders.service';
import { PdfService } from 'utils/services/pdf.service';

@Module({
  controllers: [ShopOrdersController],
  providers: [ShopOrdersService, PdfService],
})
export class ShopOrdersModule {}
