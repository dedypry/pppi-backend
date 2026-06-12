import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create.dto';
import { MessageModel } from 'models/Message.model';
import { PaginationDto } from 'utils/dto/pagination.dto';

@Injectable()
export class MessagesService {
  async list(query: PaginationDto) {
    return await MessageModel.query()
      .where((builder) => {
        if (query.q) {
          builder
            .whereILike('name', `%${query.q}%`)
            .orWhereILike('email', `%${query.q}%`)
            .orWhereILike('subject', `%${query.q}%`)
            .orWhereILike('content', `%${query.q}%`);
        }
      })
      .orderBy('created_at', 'desc')
      .page((query.page || 0) - 1, query.pageSize || 10);
  }

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
