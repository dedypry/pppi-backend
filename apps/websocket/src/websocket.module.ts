import { Module } from '@nestjs/common';
import { BlogCommentModule } from './sockets/blog-comment/blog-comment.module';

@Module({
  imports: [BlogCommentModule],
})
export class WebsocketModule {}
