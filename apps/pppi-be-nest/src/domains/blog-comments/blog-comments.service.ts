import { Injectable } from '@nestjs/common';
import { BlogCommentsModel } from 'models/BlogComments.model';

@Injectable()
export class BlogCommentsService {
  async list(blogId: number) {
    return await BlogCommentsModel.query()
      .modify('child')
      .where('blog_id', blogId)
      .whereNull('parent_id')
      .orderBy('created_at', 'desc');
  }
}
