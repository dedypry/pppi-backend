import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { PdfService } from 'utils/services/pdf.service';
import { ExcelService } from 'utils/services/excel.service';
import { ExcelJsService } from 'utils/services/exceljs.service';
import { BullModule } from '@nestjs/bull';
import { MailQueueProcessor } from '../../queue/mail.queue.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'MAIL-QUEUE',
    }),
  ],
  controllers: [MembersController],
  providers: [
    MembersService,
    PdfService,
    ExcelService,
    ExcelJsService,
    MailQueueProcessor,
  ],
})
export class MembersModule {}
