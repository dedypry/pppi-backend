import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create.dto';
import { AuthGuard } from 'guard/auth.guard';
import { PaginationDto } from 'utils/dto/pagination.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('admin/list')
  @UseGuards(AuthGuard)
  list(@Query() query: PaginationDto) {
    query.page = query.page ? query.page - 1 : 0;
    return this.messagesService.list(query);
  }

  @Post()
  sendMessage(@Body() body: CreateMessageDto) {
    return this.messagesService.create(body);
  }
}
