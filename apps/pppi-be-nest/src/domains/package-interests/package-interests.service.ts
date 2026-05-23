import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePackageInterestDto } from './dto/create.dto';
import { PackageInterestModel } from 'models/PackageInterest.model';
import { PaginationDto } from 'utils/dto/pagination.dto';
import { UpdatePackageInterestStatusDto } from './dto/update-status.dto';

@Injectable()
export class PackageInterestsService {
  async create(body: CreatePackageInterestDto) {
    await PackageInterestModel.query().insert({
      package_id: body.package_id || null,
      package_group: body.package_group,
      package_title: body.package_title,
      name: body.name,
      email: body.email,
      phone: body.phone,
      institution: body.institution || null,
      note: body.note || null,
      status: 'new',
    });

    return 'Minat paket berhasil dikirim';
  }

  async list(query: PaginationDto) {
    return await PackageInterestModel.query()
      .withGraphFetched('package')
      .where((builder) => {
        if (query.q) {
          builder
            .whereILike('name', `%${query.q}%`)
            .orWhereILike('email', `%${query.q}%`)
            .orWhereILike('phone', `%${query.q}%`)
            .orWhereILike('package_title', `%${query.q}%`)
            .orWhereILike('package_group', `%${query.q}%`);
        }
      })
      .where((builder) => {
        if (query.status && query.status !== 'all') {
          builder.where('status', query.status);
        }
      })
      .orderBy('created_at', 'desc')
      .page(query.page, query.pageSize);
  }

  async updateStatus(id: number, body: UpdatePackageInterestStatusDto) {
    const data = await PackageInterestModel.query().findById(id);

    if (!data) {
      throw new NotFoundException();
    }

    await data.$query().patch({
      status: body.status,
    });

    return 'Status minat paket berhasil diperbarui';
  }

  async destroy(id: number) {
    const data = await PackageInterestModel.query().findById(id);

    if (!data) {
      throw new NotFoundException();
    }

    await data.$query().delete();

    return 'Data minat paket berhasil dihapus';
  }
}
