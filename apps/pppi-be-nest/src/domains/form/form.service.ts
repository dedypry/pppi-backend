import { Injectable } from '@nestjs/common';
import { CreateFormDto } from './dto/create.dto';
import { FormModel } from 'models/Form.model';
import { Slug } from 'utils/helpers/global';
import { FormHeaderModel } from 'models/FormHeader.model';

@Injectable()
export class FormService {
  async create(body: CreateFormDto) {
    const form = await FormModel.query().upsertGraphAndFetch({
      id: body.id,
      title: body.title,
      slug: Slug(body.title),
      description: body.description,
      member_requied: body.member_required,
    });

    for (const item of body.form_headers) {
      await FormHeaderModel.query().upsertGraph({
        id: item.id,
        form_id: form.id,
        key: Slug(item.title),
        title: item.title,
        sort: item.sort,
        type: item.type,
        options: JSON.stringify(item.options),
      });
    }

    return 'form berhasil di tambahkan';
  }
}
