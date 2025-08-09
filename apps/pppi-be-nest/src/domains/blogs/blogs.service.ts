/* eslint-disable @typescript-eslint/no-floating-promises */
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import BlogCategoryCreateDto, {
  BlogCategoryStatusDto,
} from './dto/create-blog-category.dto';
import { BlogCategoriesModel } from 'models/BlogCategories.model';
import BlogCreateDto, { BlogUpdateStatusDto } from './dto/create-blog.dto';
import { BlogModel } from 'models/Blog.model';
import { generateRandomString, Slug } from 'utils/helpers/global';
import { BlogCommentsModel } from 'models/BlogComments.model';
import { PaginationDto } from 'utils/dto/pagination.dto';
import {
  destroyFile,
  setFileParent,
} from 'utils/services/file-gallery.service';
import { fn } from 'objection';

@Injectable()
export class BlogsService {
  async listCategory(query: PaginationDto) {
    return await BlogCategoriesModel.query()
      .orderBy('created_at', 'DESC')
      .page(query.page, query.pageSize);
  }

  async createBlogCategory(body: BlogCategoryCreateDto) {
    const categories = await BlogCategoriesModel.query().upsertGraphAndFetch({
      id: body?.id,
      name: body.name,
      icon: body.icon,
      is_active: body.is_active,
      description: body.description,
    });

    if (categories.icon) {
      setFileParent(categories.icon, categories);
    }
    return categories;
  }

  async updateStatusCategory(id: number, data: BlogCategoryStatusDto) {
    const category = await BlogCategoriesModel.query().findById(id);

    if (!category) throw new NotFoundException();

    await category.$query().update({
      is_active: data.status,
    });

    return 'Data berhasil di update';
  }

  async destroyCategory(id: number) {
    const category = await BlogCategoriesModel.query().findById(id);

    if (!category) throw new NotFoundException();

    const blogs = await BlogModel.query().findOne('category_id', category.id);

    if (blogs) throw new ForbiddenException('Hapus Blog terlebih dahulu');

    destroyFile({
      url: category.icon!,
    });

    await category.$query().delete();

    return 'Category berhasil di hapus';
  }

  async listBlogs(query: PaginationDto) {
    return await BlogModel.query()
      .withGraphFetched('[category, writer]')
      .orderBy('created_at', 'DESC')
      .page(query.page, query.pageSize);
  }

  async detailBlogs(id: number) {
    const blog = await BlogModel.query()
      .withGraphFetched('[category, writer]')
      .findById(id);

    if (!blog) throw new NotFoundException();

    return blog;
  }

  async createBlogs(body: BlogCreateDto, userId: number) {
    const slug = await this.generateSlug(body.title);

    const blog = await BlogModel.query().upsertGraph({
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

    if (blog.cover) {
      setFileParent(blog.cover, blog);
    }

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
    destroyFile({
      url: blog.cover!,
    });
    await blog.$query().delete();

    return 'blog berhasil di hapus';
  }

  async updateBlogStatus(id: number, body: BlogUpdateStatusDto) {
    const blog = await BlogModel.query().findById(id);

    if (!blog) throw new NotFoundException();

    await blog.$query().update({
      status: body.status,
      ...(body.status == ('publish' as any) && {
        publish_at: fn.now(),
      }),
    });
  }
}
