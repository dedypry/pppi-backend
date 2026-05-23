import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateShopOrderDto } from './dto/create.dto';
import { ProductModel } from 'models/Product.model';
import { ShopOrderModel } from 'models/ShopOrder.model';
import { raw } from 'objection';
import { PaginationDto } from 'utils/dto/pagination.dto';
import { UpdateShopOrderStatusDto } from './dto/update-status.dto';

@Injectable()
export class ShopOrdersService {
  async list(query: PaginationDto) {
    return await ShopOrderModel.query()
      .withGraphFetched(
        'items.[product.[uom, category, subcategory, showcase]]',
      )
      .where((builder) => {
        if (query.q) {
          builder
            .whereILike('order_code', `%${query.q}%`)
            .orWhereILike('customer_name', `%${query.q}%`)
            .orWhereILike('customer_email', `%${query.q}%`)
            .orWhereILike('customer_phone', `%${query.q}%`);
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

  async notifications(limit?: number) {
    const rowLimit = Number(limit) > 0 ? Number(limit) : 5;
    const unreadFilter = ShopOrderModel.query()
      .where('status', 'pending')
      .whereNull('admin_seen_at');

    const [unreadCount, unreadOrders] = await Promise.all([
      unreadFilter.clone().resultSize(),
      unreadFilter
        .clone()
        .withGraphFetched('items.[product]')
        .orderBy('created_at', 'desc')
        .limit(rowLimit),
    ]);

    return {
      new_orders_count: unreadCount,
      items: unreadOrders,
    };
  }

  async detail(id: number) {
    const order = await ShopOrderModel.query()
      .withGraphFetched(
        'items.[product.[uom, category, subcategory, showcase]]',
      )
      .findById(id);

    if (!order) {
      throw new NotFoundException('Pesanan tidak ditemukan');
    }

    if (order.status === 'pending' && !order.admin_seen_at) {
      const seenAt = new Date().toISOString();

      await order.$query().patch({
        admin_seen_at: seenAt,
      });

      order.admin_seen_at = seenAt;
    }

    return order;
  }

  async markNotificationsAsRead(ids?: number[]) {
    const numericIds =
      ids
        ?.map((id) => Number(id))
        .filter((id) => Number.isFinite(id) && id > 0) || [];

    const query = ShopOrderModel.query()
      .where('status', 'pending')
      .whereNull('admin_seen_at');

    if (numericIds.length) {
      query.whereIn('id', numericIds);
    }

    const affectedRows = await query.patch({
      admin_seen_at: new Date().toISOString(),
    });

    return {
      message: 'Notifikasi pesanan baru berhasil ditandai sudah dibaca',
      affected_rows: affectedRows,
    };
  }

  async create(body: CreateShopOrderDto) {
    const productIds = body.items.map((item) => item.product_id);
    const products = await ProductModel.query().whereIn('id', productIds);

    if (!products.length) {
      throw new BadRequestException('Produk tidak ditemukan');
    }

    const itemRows = body.items.map((item) => {
      const product = products.find((prod) => prod.id === item.product_id);

      if (!product || !product.is_active) {
        throw new BadRequestException(
          `Produk dengan ID ${item.product_id} tidak aktif`,
        );
      }

      if (product.stock < item.qty) {
        throw new BadRequestException(
          `Stok produk ${product.name} tidak mencukupi`,
        );
      }

      const price = Number(product.price || 0);
      const subtotal = price * item.qty;

      return {
        product_id: product.id,
        product_name: product.name,
        price,
        qty: item.qty,
        subtotal,
      };
    });

    const total = itemRows.reduce((acc, curr) => acc + curr.subtotal, 0);
    const orderCode = `ORD-${Date.now()}`;

    await ProductModel.transaction(async (trx) => {
      const order = await ShopOrderModel.query(trx).insertGraphAndFetch({
        order_code: orderCode,
        customer_name: body.customer_name,
        customer_email: body.customer_email,
        customer_phone: body.customer_phone,
        shipping_address: body.shipping_address,
        note: body.note,
        total_amount: total,
        status: 'pending',
        admin_seen_at: null,
        items: itemRows,
      } as any);

      for (const item of itemRows) {
        await ProductModel.query(trx)
          .findById(item.product_id)
          .patch({
            stock: raw('stock - ?', [item.qty]),
          });
      }

      return order;
    });

    return {
      message: 'Checkout berhasil, pesanan Anda sedang diproses',
      order_code: orderCode,
    };
  }

  async updateStatus(id: number, body: UpdateShopOrderStatusDto) {
    const order = await ShopOrderModel.query().findById(id);

    if (!order) {
      throw new NotFoundException('Pesanan tidak ditemukan');
    }

    await order.$query().patch({
      status: body.status,
      admin_seen_at:
        order.admin_seen_at || body.status !== 'pending'
          ? order.admin_seen_at || new Date().toISOString()
          : null,
    });

    return 'Status pesanan berhasil diperbarui';
  }

  async history(email: string) {
    if (!email) {
      throw new BadRequestException('Email wajib diisi');
    }

    return await ShopOrderModel.query()
      .withGraphFetched('items.[product]')
      .where('customer_email', email)
      .orderBy('created_at', 'desc');
  }
}
