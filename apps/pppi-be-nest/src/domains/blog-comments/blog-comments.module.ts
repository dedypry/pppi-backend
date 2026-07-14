import { Module } from '@nestjs/common';
import { BlogCommentsService } from './blog-comments.service';
import { BlogCommentsController } from './blog-comments.controller';
import { PusherService } from 'utils/services/pusher.service';

@Module({
  controllers: [BlogCommentsController],
  providers: [BlogCommentsService, PusherService],
})
export class BlogCommentsModule {}
