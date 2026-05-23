import { BelongsToOne, Table } from 'decorators/objections';
import { Model } from '.';
import { ProductCategoryModel } from './ProductCategory.model';
import { ProductShowcaseModel } from './ProductShowcase.model';
import { UomModel } from './Uom.model';

@Table('products')
export class ProductModel extends Model {
  name: string;
  image?: string;
  unit?: string;
  price: number;
  stock: number;
  description?: string;
  is_active: boolean;
  category_id?: number;
  subcategory_id?: number;
  showcase_id?: number;
  uom_id?: number;
  rack_location?: string;

  @BelongsToOne(() => ProductCategoryModel, {
    from: 'products.category_id',
    to: 'product_categories.id',
  })
  category: ProductCategoryModel;

  @BelongsToOne(() => ProductCategoryModel, {
    from: 'products.subcategory_id',
    to: 'product_categories.id',
  })
  subcategory: ProductCategoryModel;

  @BelongsToOne(() => ProductShowcaseModel, {
    from: 'products.showcase_id',
    to: 'product_showcases.id',
  })
  showcase: ProductShowcaseModel;

  @BelongsToOne(() => UomModel, {
    from: 'products.uom_id',
    to: 'uoms.id',
  })
  uom: UomModel;
}
