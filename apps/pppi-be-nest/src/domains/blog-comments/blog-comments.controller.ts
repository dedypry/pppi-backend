import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { BlogCommentsService } from './blog-comments.service';
import { CreateCommentDto } from './dto/create.dto';

@Controller('blog-comments')
export class BlogCommentsController {
  constructor(private readonly blogCommentsService: BlogCommentsService) {}

  @Get(':id')
  list(@Param('id') id: number) {
    return this.blogCommentsService.list(id);
  }

  @Post()
  create(@Body() body: CreateCommentDto) {
    return this.blogCommentsService.create(body);
  }

  @Delete(':id')
  destroy(@Param('id') id: number) {
    return this.blogCommentsService.destroy(id);
  }
}
