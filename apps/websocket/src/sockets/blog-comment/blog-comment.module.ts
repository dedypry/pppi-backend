import { Module } from '@nestjs/common';
import { BlogCommentService } from './blog-comment.service';
import { BlogCommentGateway } from './blog-comment.gateway';

@Module({
  providers: [BlogCommentGateway, BlogCommentService],
})
export class BlogCommentModule {}
