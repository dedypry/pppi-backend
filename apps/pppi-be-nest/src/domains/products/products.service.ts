import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductModel } from 'models/Product.model';
import { ProductCreateDto } from './dto/create.dto';

@Injectable()
export class ProductsService {
  async listPublic() {
    return await ProductModel.query()
      .withGraphFetched('[category, subcategory, uom, showcase]')
      .where('is_active', true)
      .orderBy('created_at', 'desc');
  }

  async listAdmin() {
    return await ProductModel.query()
      .withGraphFetched('[category, subcategory, uom, showcase]')
      .orderBy('created_at', 'desc');
  }

  async detail(id: number) {
    const product = await ProductModel.query()
      .withGraphFetched('[category, subcategory, uom, showcase]')
      .findById(id)
      .where('is_active', true);

    if (!product) throw new NotFoundException('Produk tidak ditemukan');

    return product;
  }

  async create(body: ProductCreateDto) {
    await ProductModel.query().upsertGraph({
      id: body.id,
      name: body.name,
      image: body.image,
      unit: body.unit,
      price: body.price,
      stock: body.stock,
      description: body.description,
      category_id: body.category_id,
      subcategory_id: body.subcategory_id,
      showcase_id: body.showcase_id,
      uom_id: body.uom_id,
      rack_location: body.rack_location,
      is_active: body.is_active ?? true,
    } as any);

    return `Produk berhasil ${body.id ? 'diperbarui' : 'ditambahkan'}`;
  }

  async destroy(id: number) {
    const product = await ProductModel.query().findById(id);

    if (!product) throw new NotFoundException('Produk tidak ditemukan');

    await product.$query().delete();

    return 'Produk berhasil dihapus';
  }
}
