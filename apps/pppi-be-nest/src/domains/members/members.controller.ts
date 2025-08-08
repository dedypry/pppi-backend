import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { MemberCreateDto } from './dto/create.dto';
import { PaginationDto } from 'utils/dto/pagination.dto';
import MemberApprovedDto from './dto/approved.dto';
import { AuthGuard } from 'guard/auth.guard';

@Controller('members')
@UseGuards(AuthGuard)
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  list(@Query() query: PaginationDto) {
    return this.membersService.list(query);
  }

  @Get(':id')
  detail(@Param('id') id: number) {
    return this.membersService.detail(id);
  }

  @Post()
  create(@Body() body: MemberCreateDto) {
    return this.membersService.create(body);
  }

  @Patch(':id')
  approved(
    @Param('id') id: number,
    @Body() body: MemberApprovedDto,
    @Req() req: any,
  ) {
    return this.membersService.updateApproved(body, id, req['user']['id']);
  }
}
