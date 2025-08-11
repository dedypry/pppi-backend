import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create.dto';
import { BlogCommentsModel } from 'models/BlogComments.model';
import { BlogModel } from 'models/Blog.model';

@Injectable()
export class BlogCommentService {
  async createComment(body: CreateCommentDto): Promise<BlogModel> {
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

    return blog!;
  }
}
