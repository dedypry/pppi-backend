import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { PdfService } from 'utils/services/pdf.service';
import { ExcelService } from 'utils/services/excel.service';

@Module({
  controllers: [MembersController],
  providers: [MembersService, PdfService, ExcelService],
})
export class MembersModule {}
