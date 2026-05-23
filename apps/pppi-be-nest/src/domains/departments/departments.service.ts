import { Injectable, NotFoundException } from '@nestjs/common';
import { DepartmentModel } from 'models/Department.model';
import { DepartmentCreateDto } from './dto/create.dto';

@Injectable()
export class DepartmentsService {
  async list() {
    return await DepartmentModel.query().orderBy('created_at', 'desc');
  }

  async create(body: DepartmentCreateDto) {
    await DepartmentModel.query().upsertGraph({
      id: body.id,
      name: body.name,
      code: body.code,
      description: body.description,
      is_active: body.is_active ?? true,
    } as any);

    return `Department berhasil ${body.id ? 'diperbarui' : 'ditambahkan'}`;
  }

  async destroy(id: number) {
    const data = await DepartmentModel.query().findById(id);

    if (!data) throw new NotFoundException();

    await data.$query().delete();

    return 'Department berhasil dihapus';
  }
}
