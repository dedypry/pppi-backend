import { Injectable, NotFoundException } from '@nestjs/common';
import { PackageModel } from 'models/Package.model';
import { PackageUpdateDto } from './dto/create.dto';

@Injectable()
export class PackagesService {
  async list() {
    const packages = await PackageModel.query()
      .modify('child')
      .whereNull('parent_id')
      .orderBy('id', 'desc');

    return packages;
  }

  async create(body: PackageUpdateDto) {
    await PackageModel.query().upsertGraph({
      id: body.id,
      title: body.title,
      description: body.description,
      benefit: body.benefit,
      types: body.types,
      parent_id: body.parent_id,
    });

    return 'data berhasil disimpan';
  }

  async destroy(id: number) {
    const pckg = await PackageModel.query().findById(id);

    if (!pckg) throw new NotFoundException();

    await PackageModel.query().where('parent_id', pckg.id).delete();

    await pckg.$query().delete();

    return 'data berhasil dihapus';
  }
}
