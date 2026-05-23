import { Injectable, NotFoundException } from '@nestjs/common';
import { PartnerModel } from 'models/Partner.model';
import { PartnerCreateDto } from './dto/create.dto';

@Injectable()
export class PartnersService {
  async list() {
    return await PartnerModel.query().orderBy('created_at', 'desc');
  }

  async create(body: PartnerCreateDto) {
    await PartnerModel.query().upsertGraph({
      id: body.id,
      name: body.name,
      logo: body.logo,
      website: body.website,
      description: body.description,
    } as any);

    return `Partner berhasil ${body.id ? 'diperbarui' : 'ditambahkan'}`;
  }

  async destroy(id: number) {
    const partner = await PartnerModel.query().findById(id);

    if (!partner) {
      throw new NotFoundException();
    }

    await partner.$query().delete();

    return 'Partner berhasil dihapus';
  }
}
