import { Body, Controller, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  sendMessage(@Body() body: CreateMessageDto) {
    return this.messagesService.create(body);
  }
}
