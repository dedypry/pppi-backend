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
    const payload = {
      title: body.title,
      description: body.description,
      user_id: body.user_id || null,
      parent_id: body.parent_id ? Number(body.parent_id) : null,
    } as any;

    if (body.id) {
      const existing = await OrganizationModel.query().findById(body.id);
      if (!existing) throw new NotFoundException('Organisasi tidak ditemukan');

      await existing.$query().patch(payload);
      return 'Organisasi berhasil diperbaharui';
    }

    await OrganizationModel.query().insert(payload);
    return 'Organisasi berhasil di tambahkan';
  }

  async assignUser(id: number, userId: number) {
    const existing = await OrganizationModel.query().findById(id);
    if (!existing) throw new NotFoundException('Organisasi tidak ditemukan');

    await existing.$query().patch({ user_id: userId });
    return 'User berhasil ditetapkan ke organisasi';
  }

  async destroy(id: number) {
    const result = await OrganizationModel.query().findById(id);

    if (!result) throw new NotFoundException();

    await result.$query().delete();

    return 'Data berhasil di hapus';
  }
}
