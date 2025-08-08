import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { PdfService } from 'utils/services/pdf.service';

@Module({
  controllers: [MembersController],
  providers: [MembersService, PdfService],
})
export class MembersModule {}
