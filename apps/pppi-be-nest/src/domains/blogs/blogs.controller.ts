import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { PaginationDto } from 'utils/dto/pagination.dto';
import BlogCreateDto, { BlogUpdateStatusDto } from './dto/create-blog.dto';
import BlogCategoryCreateDto, {
  BlogCategoryStatusDto,
} from './dto/create-blog-category.dto';
import { AuthGuard } from 'guard/auth.guard';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get()
  list(@Query() query: PaginationDto) {
    query.page = query.page - 1;
    return this.blogsService.listBlogs(query);
  }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() body: BlogCreateDto, @Req() req: any) {
    return this.blogsService.createBlogs(body, req['user']['id']);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  destroy(@Param('slug') slug: string) {
    return this.blogsService.destroy(slug);
  }

  @Patch('status/:id')
  @UseGuards(AuthGuard)
  updateBlogStatus(@Param('id') id: number, @Body() body: BlogUpdateStatusDto) {
    return this.blogsService.updateBlogStatus(id, body);
  }

  @Get('categories')
  listCategory(@Query() query: PaginationDto) {
    query.page = query.page - 1;
    return this.blogsService.listCategory(query);
  }

  @Get(':id')
  blogDetail(@Param('id') id: number) {
    return this.blogsService.detailBlogs(id);
  }

  @Post('categories')
  @UseGuards(AuthGuard)
  createCategory(@Body() body: BlogCategoryCreateDto) {
    return this.blogsService.createBlogCategory(body);
  }

  @Patch('categories/status/:id')
  @UseGuards(AuthGuard)
  updateStatusCategory(
    @Param('id') id: number,
    @Body() body: BlogCategoryStatusDto,
  ) {
    return this.blogsService.updateStatusCategory(id, body);
  }

  @Delete('categories/:id')
  @UseGuards(AuthGuard)
  destroyCategory(@Param('id') id: number) {
    return this.blogsService.destroyCategory(id);
  }
}
