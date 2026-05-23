import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductCategoryModel } from 'models/ProductCategory.model';
import { ProductShowcaseModel } from 'models/ProductShowcase.model';
import { UomModel } from 'models/Uom.model';
import { UpsertMasterDto } from './dto/upsert-master.dto';
import { UpsertProductCategoryDto } from './dto/upsert-category.dto';

@Injectable()
export class ProductMastersService {
  async listCategories() {
    return await ProductCategoryModel.query()
      .select('id', 'parent_id', 'name', 'description', 'status', 'created_at')
      .orderBy('name', 'asc');
  }

  async upsertCategory(body: UpsertProductCategoryDto) {
    await ProductCategoryModel.query().upsertGraph({
      id: body.id,
      parent_id: body.parent_id || null,
      name: body.name,
      description: body.description,
      status: 'active',
    } as any);

    return `Master kategori berhasil ${body.id ? 'diperbarui' : 'ditambahkan'}`;
  }

  async destroyCategory(id: number) {
    const category = await ProductCategoryModel.query().findById(id);
    if (!category) throw new NotFoundException('Kategori tidak ditemukan');

    await ProductCategoryModel.query().delete().where('parent_id', id);
    await category.$query().delete();

    return 'Master kategori berhasil dihapus';
  }

  async listShowcases() {
    return await ProductShowcaseModel.query().orderBy('name', 'asc');
  }

  async upsertShowcase(body: UpsertMasterDto) {
    await ProductShowcaseModel.query().upsertGraph({
      id: body.id,
      name: body.name,
      description: body.description,
      is_active: body.is_active ?? true,
    } as any);

    return `Master etalase berhasil ${body.id ? 'diperbarui' : 'ditambahkan'}`;
  }

  async destroyShowcase(id: number) {
    const showcase = await ProductShowcaseModel.query().findById(id);
    if (!showcase) throw new NotFoundException('Etalase tidak ditemukan');

    await showcase.$query().delete();

    return 'Master etalase berhasil dihapus';
  }

  async listUoms() {
    return await UomModel.query().orderBy('name', 'asc');
  }

  async upsertUom(body: UpsertMasterDto) {
    await UomModel.query().upsertGraph({
      id: body.id,
      name: body.name,
      code: body.code,
      description: body.description,
      is_active: body.is_active ?? true,
    } as any);

    return `Master UOM berhasil ${body.id ? 'diperbarui' : 'ditambahkan'}`;
  }

  async destroyUom(id: number) {
    const uom = await UomModel.query().findById(id);
    if (!uom) throw new NotFoundException('UOM tidak ditemukan');

    await uom.$query().delete();

    return 'Master UOM berhasil dihapus';
  }
}
