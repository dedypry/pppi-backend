import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductCreateDto } from './dto/create.dto';
import { AuthGuard } from 'guard/auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  listPublic() {
    return this.productsService.listPublic();
  }

  @Get('admin/list')
  @UseGuards(AuthGuard)
  listAdmin() {
    return this.productsService.listAdmin();
  }

  @Get(':id')
  detail(@Param('id') id: number) {
    return this.productsService.detail(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  createAndUpdate(@Body() body: ProductCreateDto) {
    return this.productsService.create(body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  destroy(@Param('id') id: number) {
    return this.productsService.destroy(id);
  }
}
