import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProductMastersService } from './product-masters.service';
import { AuthGuard } from 'guard/auth.guard';
import { UpsertProductCategoryDto } from './dto/upsert-category.dto';
import { UpsertMasterDto } from './dto/upsert-master.dto';

@Controller('product-masters')
@UseGuards(AuthGuard)
export class ProductMastersController {
  constructor(private readonly productMastersService: ProductMastersService) {}

  @Get('categories')
  listCategories() {
    return this.productMastersService.listCategories();
  }

  @Post('categories')
  upsertCategory(@Body() body: UpsertProductCategoryDto) {
    return this.productMastersService.upsertCategory(body);
  }

  @Delete('categories/:id')
  destroyCategory(@Param('id') id: number) {
    return this.productMastersService.destroyCategory(id);
  }

  @Get('showcases')
  listShowcases() {
    return this.productMastersService.listShowcases();
  }

  @Post('showcases')
  upsertShowcase(@Body() body: UpsertMasterDto) {
    return this.productMastersService.upsertShowcase(body);
  }

  @Delete('showcases/:id')
  destroyShowcase(@Param('id') id: number) {
    return this.productMastersService.destroyShowcase(id);
  }

  @Get('uoms')
  listUoms() {
    return this.productMastersService.listUoms();
  }

  @Post('uoms')
  upsertUom(@Body() body: UpsertMasterDto) {
    return this.productMastersService.upsertUom(body);
  }

  @Delete('uoms/:id')
  destroyUom(@Param('id') id: number) {
    return this.productMastersService.destroyUom(id);
  }
}
