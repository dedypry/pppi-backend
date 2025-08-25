import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFormDto, SubmitFormResultDto } from './dto/create.dto';
import { FormModel } from 'models/Form.model';
import { Slug } from 'utils/helpers/global';
import { FormHeaderModel } from 'models/FormHeader.model';
import { PaginationDto } from 'utils/dto/pagination.dto';
import { AnyQueryBuilder } from 'objection';
import { FormResultModel } from 'models/FormResult.model';
import { UserModel } from 'models/User.model';

@Injectable()
export class FormService {
  async list(query: PaginationDto) {
    const result = FormModel.query().orderBy('created_at', 'desc');

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

  async create(body: CreateFormDto) {
    const form = await FormModel.query().upsertGraphAndFetch({
      id: body.id,
      title: body.title,
      slug: Slug(body.title),
      description: body.description,
      member_required: body.member_required,
    });

    for (const item of body.form_headers) {
      await FormHeaderModel.query().upsertGraph({
        id: item.id,
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
}
