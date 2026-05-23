import { BelongsToOne, Table } from 'decorators/objections';
import { Model } from '.';
import { ProductModel } from './Product.model';
import { ShopOrderModel } from './ShopOrder.model';

@Table('shop_order_items')
export class ShopOrderItemModel extends Model {
  order_id: number;
  product_id: number;
  product_name: string;
  price: number;
  qty: number;
  subtotal: number;

  @BelongsToOne(() => ProductModel, {
    from: 'shop_order_items.product_id',
    to: 'products.id',
  })
  product: ProductModel;

  @BelongsToOne(() => ShopOrderModel, {
    from: 'shop_order_items.order_id',
    to: 'shop_orders.id',
  })
  order: ShopOrderModel;
}
