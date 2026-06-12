import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ShopOrdersService } from './shop-orders.service';
import { CreateShopOrderDto } from './dto/create.dto';
import { AuthGuard } from 'guard/auth.guard';
import { PaginationDto } from 'utils/dto/pagination.dto';
import { UpdateShopOrderStatusDto } from './dto/update-status.dto';
import { MarkShopOrderNotificationReadDto } from './dto/mark-notification-read.dto';
import { PdfService } from 'utils/services/pdf.service';
import { getHtmlContent } from '../../services/html-contect';

@Controller('shop-orders')
export class ShopOrdersController {
  constructor(
    private readonly shopOrdersService: ShopOrdersService,
    private readonly pdfService: PdfService,
  ) {}

  private formatRupiah(value: number) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(Number(value || 0));
  }

  private formatDateTime(value?: string) {
    return new Date(value || new Date().toISOString()).toLocaleString('id-ID');
  }

  @Get('admin/list')
  @UseGuards(AuthGuard)
  list(@Query() query: PaginationDto) {
    query.page = query.page ? query.page - 1 : 0;
    return this.shopOrdersService.list(query);
  }

  @Get('admin/transactions')
  @UseGuards(AuthGuard)
  transactions(@Query() query: PaginationDto) {
    query.page = query.page ? query.page - 1 : 0;
    return this.shopOrdersService.list(query);
  }

  @Get('admin/transactions/:id')
  @UseGuards(AuthGuard)
  transactionDetail(@Param('id') id: number) {
    return this.shopOrdersService.detail(id);
  }

  @Get('admin/transactions/:id/invoice')
  @UseGuards(AuthGuard)
  async transactionInvoice(@Param('id') id: number, @Res() res: Response) {
    const order = await this.shopOrdersService.detail(id);
    const createdAt = order.created_at || new Date().toISOString();
    const statusLabel = String(order.status || '').toUpperCase();
    const items = (order.items || []).map((item) => {
      const category = item.product?.category?.name || '-';
      const subcategory = item.product?.subcategory?.name || '';

      return {
        ...item,
        detail: `${category}${subcategory ? ` > ${subcategory}` : ''} | Rak: ${item.product?.rack_location || '-'} | UOM: ${item.product?.uom?.code || '-'}`,
        price_format: this.formatRupiah(Number(item.price || 0)),
        subtotal_format: this.formatRupiah(Number(item.subtotal || 0)),
      };
    });

    const html = await getHtmlContent('invoice', {
      ...order,
      created_at_format: this.formatDateTime(createdAt),
      status_label: statusLabel,
      items,
      total_amount_format: this.formatRupiah(Number(order.total_amount || 0)),
    });

    await this.pdfService.downloadPdf({
      htmlContent: html,
      res,
      name: `invoice-${order.order_code}`,
    });
  }

  @Get('admin/notifications')
  @UseGuards(AuthGuard)
  notifications(@Query('limit') limit: number) {
    return this.shopOrdersService.notifications(limit);
  }

  @Patch('admin/notifications/read')
  @UseGuards(AuthGuard)
  markNotificationsAsRead(@Body() body: MarkShopOrderNotificationReadDto) {
    return this.shopOrdersService.markNotificationsAsRead(body.ids);
  }

  @Post()
  create(@Body() body: CreateShopOrderDto) {
    return this.shopOrdersService.create(body);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard)
  updateStatus(@Param('id') id: number, @Body() body: UpdateShopOrderStatusDto) {
    return this.shopOrdersService.updateStatus(id, body);
  }

  @Get('history')
  history(@Query('email') email: string) {
    return this.shopOrdersService.history(email);
  }
}
