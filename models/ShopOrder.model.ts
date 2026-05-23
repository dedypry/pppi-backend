import { HasMany, Table } from 'decorators/objections';
import { Model } from '.';
import { ShopOrderItemModel } from './ShopOrderItem.model';

@Table('shop_orders')
export class ShopOrderModel extends Model {
  order_code: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  note?: string;
  total_amount: number;
  status: string;
  admin_seen_at?: string | null;

  @HasMany(() => ShopOrderItemModel, {
    from: 'shop_orders.id',
    to: 'shop_order_items.order_id',
  })
  items: ShopOrderItemModel[];
}
