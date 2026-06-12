import { Module } from '@nestjs/common';
import { FormService } from './form.service';
import { FormController } from './form.controller';
import { ExcelJsService } from 'utils/services/exceljs.service';

@Module({
  controllers: [FormController],
  providers: [FormService, ExcelJsService],
})
export class FormModule {}
