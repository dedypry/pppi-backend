import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { PaginationDto } from 'utils/dto/pagination.dto';
import BlogCreateDto from './dto/create-blog.dto';
import BlogCategoryCreateDto from './dto/create-blog-category.dto';
import { AuthGuard } from 'guard/auth.guard';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get()
  list(@Query() query: PaginationDto) {
    return this.blogsService.listBlogs(query);
  }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() body: BlogCreateDto, @Req() req: any) {
    console.log(req['user']);
    return this.blogsService.createBlogs(body, req['user']['id']);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  destroy(@Param('slug') slug: string) {
    return this.blogsService.destroy(slug);
  }

  @Get('categories')
  listCategory() {
    return this.blogsService.listCategory();
  }

  @Post('categories')
  @UseGuards(AuthGuard)
  createCategory(@Body() body: BlogCategoryCreateDto) {
    return this.blogsService.createBlogCategory(body);
  }

  @Delete('categories/:id')
  @UseGuards(AuthGuard)
  destroyCategory(@Param('id') id: number) {
    return this.blogsService.destroyCategory(id);
  }
}
