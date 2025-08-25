import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFormDto, SubmitFormResultDto } from './dto/create.dto';
import { FormModel } from 'models/Form.model';
import { Slug } from 'utils/helpers/global';
import { FormHeaderModel } from 'models/FormHeader.model';
import { PaginationDto } from 'utils/dto/pagination.dto';
import { AnyQueryBuilder, raw } from 'objection';
import { FormResultModel } from 'models/FormResult.model';
import { UserModel } from 'models/User.model';

@Injectable()
export class FormService {
  async list(query: PaginationDto) {
    const result = FormModel.query()
      .alias('f')
      .select('f.*', raw('coalesce(fs.result_total,0)::int').as('result_total'))
      .join(
        FormResultModel.query()
          .select('form_id', raw('count(*) as result_total'))
          .groupBy('form_id')
          .as('fs'),
        'fs.form_id',
        'f.id',
      )
      .orderBy('created_at', 'desc');

    if (query.page >= 0) {
      return await result.page(query.page - 1, query.pageSize);
    }

    return await result;
  }

  async detail(slug: string) {
    const where = isNaN(Number(slug)) ? 'slug' : 'id';
    const result = await FormModel.query()
      .withGraphFetched('form_headers(sortOrder)')
      .findOne(where, slug)
      .modifiers({
        sortOrder: (query: AnyQueryBuilder) => query.orderBy('sort', 'asc'),
      });

    return result;
  }
  async detailResult(slug: string) {
    const where = isNaN(Number(slug)) ? 'slug' : 'id';
    const result = await FormModel.query()
      .withGraphFetched(
        '[form_results(sortOrder).user(list).profile, form_headers(sortOrderHeader)]',
      )
      .findOne(where, slug)
      .modifiers({
        sortOrder: (query: AnyQueryBuilder) =>
          query.orderBy('created_at', 'desc'),
        sortOrderHeader: (query: AnyQueryBuilder) =>
          query.orderBy('sort', 'asc'),
      });

    return result;
  }

  async create(body: CreateFormDto) {
    const form = await FormModel.query().upsertGraphAndFetch({
      id: body.id,
      title: body.title,
      slug: Slug(body.title),
      description: body.description,
      member_required: body.member_required,
    });

    await FormHeaderModel.query().where('form_id', form.id).delete();

    for (const item of body.form_headers) {
      await FormHeaderModel.query().insert({
        form_id: form.id,
        key: Slug(item.title),
        title: item.title,
        sort: item.sort,
        type: item.type,
        required: item.required,
        options: JSON.stringify(item.options),
      });
    }

    return 'form berhasil di tambahkan';
  }

  async formResult(body: SubmitFormResultDto) {
    const form = await FormModel.query().findById(body.form_id);

    if (!form) throw new NotFoundException();
    let user: UserModel | undefined = undefined;
    if (form.member_required) {
      user = await UserModel.query().findOne('nia', body.nia);

      if (!user) throw new NotFoundException('signup');
    }

    await FormResultModel.query().insert({
      form_id: body.form_id,
      nia: user?.nia,
      name: user?.name,
      email: user?.email,
      value: body.value,
    });

    return 'Form berhasil disimpan';
  }

  async destroy(id: number) {
    const form = await FormModel.query().findById(id);

    if (!form) throw new NotFoundException();

    await FormHeaderModel.query().where('form_id', id).delete();
    await FormResultModel.query().where('form_id', id).delete();

    await form.$query().delete();

    return 'Data Berhasil di hapus';
  }
}
