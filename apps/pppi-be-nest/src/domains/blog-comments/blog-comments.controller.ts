import { Controller, Get, Param } from '@nestjs/common';
import { BlogCommentsService } from './blog-comments.service';

@Controller('blog-comments')
export class BlogCommentsController {
  constructor(private readonly blogCommentsService: BlogCommentsService) {}

  @Get(':id')
  list(@Param('id') id: number) {
    return this.blogCommentsService.list(id);
  }
}
