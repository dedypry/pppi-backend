/* eslint-disable @typescript-eslint/no-floating-promises */
import { Injectable, NotFoundException } from '@nestjs/common';
import { ScheduleCreateDto } from './dto/create.dto';
import { SchedulerModel } from 'models/Scheduler.model';
import { createSlugModel } from 'utils/helpers/global';
import { setFileParent } from 'utils/services/file-gallery.service';
import { PaginationDto } from 'utils/dto/pagination.dto';

@Injectable()
export class SchedulersService {
  async list(query: PaginationDto) {
    const schedule = await SchedulerModel.query()
      .orderBy('created_at', 'desc')
      .page(query.page, query.pageSize);

    return schedule;
  }

  async create(body: ScheduleCreateDto, userId: number) {
    const slug = await this.generateSlug(body.title);

    const shedule = await SchedulerModel.query().upsertGraphAndFetch({
      id: body.id,
      cover: body.cover,
      title: body.title,
      slug,
      color: body.color,
      subtitle: body.subtitle,
      start_at: body.start_at,
      end_at: body.end_at,
      description: body.description,
      user_id: userId,
      price: body.price,
      is_show_web: body.is_show_web,
      discount: body.discount,
    });

    if (shedule.cover) {
      setFileParent(shedule.cover, shedule);
    }

    return 'Schedule berhasil di tambahkan';
  }

  async generateSlug(title: string) {
    const slug = await createSlugModel({
      slug: title,
      table: 'schedulers',
      key: 'slug',
    });

    return slug;
  }

  async detail(slug: string) {
    const schedule = await SchedulerModel.query().findOne('slug', slug);

    return schedule;
  }

  async destroy(id: number) {
    const schedule = await SchedulerModel.query().findById(id);

    if (!schedule) throw new NotFoundException();

    await schedule.$query().delete();

    return 'data berhasil dihapus';
  }
}
