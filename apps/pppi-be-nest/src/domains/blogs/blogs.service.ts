import { Injectable, NotFoundException } from '@nestjs/common';
import BlogCategoryCreateDto from './dto/create-blog-category.dto';
import { BlogCategoriesModel } from 'models/BlogCategories.model';
import BlogCreateDto from './dto/create-blog.dto';
import { BlogModel } from 'models/Blog.model';
import { generateRandomString, Slug } from 'utils/helpers/global';
import { BlogCommentsModel } from 'models/BlogComments.model';
import { PaginationDto } from 'utils/dto/pagination.dto';

@Injectable()
export class BlogsService {
  async listCategory() {
    return await BlogCategoriesModel.query();
  }

  async createBlogCategory(body: BlogCategoryCreateDto) {
    const category = await BlogCategoriesModel.query().upsertGraphAndFetch({
      id: body?.id,
      name: body.name,
      icon: body.icon,
      is_active: body.is_active,
    });

    return category;
  }

  async destroyCategory(id: number) {
    const category = await BlogCategoriesModel.query().findById(id);

    if (!category) throw new NotFoundException();

    await category.$query().delete();

    return 'Category berhasil di hapus';
  }

  async listBlogs(query: PaginationDto) {
    return await BlogModel.query().page(query.page, query.pageSize);
  }

  async createBlogs(body: BlogCreateDto, userId: number) {
    const slug = await this.generateSlug(body.title);

    await BlogModel.query().upsertGraph({
      id: body?.id,
      writer_id: userId,
      category_id: body.category_id,
      cover: body.cover,
      title: body.title,
      slug,
      subtitle: body.subtitle,
      content: body.content,
      tags: body.tags,
      status: 'submission',
      schedule: body.schedule,
    });

    return `blog berhasil ${body?.id ? 'diubah' : 'ditambahkan'}`;
  }

  async generateSlug(slug: string): Promise<string> {
    const sl = Slug(slug);
    const blog = await BlogModel.query().findOne('slug', sl);

    if (blog) {
      slug = await this.generateSlug(`${slug}-${generateRandomString(4)}`);
    }
    return sl;
  }

  async destroy(slug: string) {
    const blog = await BlogModel.query().findOne('slug', slug);

    if (!blog) throw new NotFoundException();

    await BlogCommentsModel.query().where('blog_id', blog.id).delete();
    await blog.$query().delete();

    return 'blog berhasil di hapus';
  }
}
