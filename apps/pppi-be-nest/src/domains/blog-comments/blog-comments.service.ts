import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogCommentsModel } from 'models/BlogComments.model';
import { BlogModel } from 'models/Blog.model';
import { PusherService } from 'utils/services/pusher.service';
import { CreateCommentDto } from './dto/create.dto';

@Injectable()
export class BlogCommentsService {
  constructor(private readonly pusherService: PusherService) {}

  async list(blogId: number) {
    return await BlogCommentsModel.query()
      .modify('child')
      .where('blog_id', blogId)
      .whereNull('parent_id')
      .orderBy('created_at', 'desc');
  }

  async create(body: CreateCommentDto) {
    const comment = await BlogCommentsModel.query().insert({
      blog_id: body.blog_id,
      parent_id: body.parent_id,
      name: body.name,
      email: body.email,
      website: body.website,
      content: body.content,
      avatar: body.avatar,
    });

    const blog = await BlogModel.query()
      .select('slug')
      .findById(comment.blog_id);

    if (blog?.slug) {
      await this.pusherService.triggerCommentRefresh(blog.slug);
    }

    return 'Comment berhasil ditambahkan';
  }

  async destroy(id: number) {
    const comment = await BlogCommentsModel.query().findById(id);

    if (!comment) throw new NotFoundException();

    await BlogCommentsModel.query().where('parent_id', comment.id).delete();

    const blog = await BlogModel.query()
      .select('slug')
      .findById(comment.blog_id);

    await comment.$query().delete();

    if (blog?.slug) {
      await this.pusherService.triggerCommentRefresh(blog.slug);
    }

    return 'Comment berhasil dihapus';
  }
}
