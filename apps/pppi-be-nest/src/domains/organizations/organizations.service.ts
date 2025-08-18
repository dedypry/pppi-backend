import { Injectable, NotFoundException } from '@nestjs/common';
import { OrganitationCreateDto } from './dto/create.dto';
import { OrganizationModel } from 'models/Organization.model';

@Injectable()
export class OrganizationsService {
  async list() {
    const result = await OrganizationModel.query()
      .modify('child')
      .whereNull('parent_id');

    return result;
  }

  async create(body: OrganitationCreateDto) {
    await OrganizationModel.query().insertGraph({
      id: body.id,
      title: body.title,
      description: body.description,
      user_id: body.user_id,
      parent_id: body.parent_id,
    } as any);

    return 'Organisasi berhasil di tambahkan';
  }

  async destroy(id: number) {
    const result = await OrganizationModel.query().findById(id);

    if (!result) throw new NotFoundException();

    await result.$query().delete();

    return 'Data berhasil di hapus';
  }
}
