import { Injectable, NotFoundException } from '@nestjs/common';
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

  async destroy(id: number) {
    const comment = await BlogCommentsModel.query().findById(id);

    if (!comment) throw new NotFoundException();

    await BlogCommentsModel.query().where('parent_id', comment.id).delete();

    await comment.$query().delete();

    return 'Comment berhasil dihapus';
  }
}
