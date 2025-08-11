import { Module } from '@nestjs/common';
import { BlogCommentsService } from './blog-comments.service';
import { BlogCommentsController } from './blog-comments.controller';

@Module({
  controllers: [BlogCommentsController],
  providers: [BlogCommentsService],
})
export class BlogCommentsModule {}
