import { HasMany, Modifier, Table } from 'decorators/objections';
import { Model } from '.';
import { AnyQueryBuilder } from 'objection';

@Table('product_categories')
export class ProductCategoryModel extends Model {
  name!: string;
  image!: string;
  description?: string;
  parent_id?: number;
  user_id!: number;
  status!: string;

  @Modifier
  child(query: AnyQueryBuilder) {
    query.withGraphFetched('children(child)');
  }

  @HasMany(() => ProductCategoryModel, {
    from: 'product_categories.id',
    to: 'product_categories.parent_id',
  })
  children!: ProductCategoryModel[];
}
