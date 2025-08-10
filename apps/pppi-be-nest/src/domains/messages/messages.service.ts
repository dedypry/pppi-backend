import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create.dto';
import { MessageModel } from 'models/Message.model';

@Injectable()
export class MessagesService {
  async create(body: CreateMessageDto) {
    await MessageModel.query().insert({
      name: body.name,
      email: body.email,
      subject: body.subject,
      content: body.content,
    });

    return 'Pesan Berhasil terkirim';
  }
}
