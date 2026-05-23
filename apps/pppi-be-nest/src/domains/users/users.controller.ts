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
import { UsersService } from './users.service';
import CheckEmailDto from './dto/check-mail.dto';
import { AuthGuard } from 'guard/auth.guard';
import { PaginationDto } from 'utils/dto/pagination.dto';
import UpdateUserSettingDto from './dto/update-setting.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get()
  list(@Query() query: PaginationDto) {
    query.page = (query.page || 1) - 1;
    return this.usersService.list(query);
  }

  @Post('check-email')
  checkMail(@Body() body: CheckEmailDto) {
    return this.usersService.checkEmail(body);
  }

  @UseGuards(AuthGuard)
  @Patch(':id/settings')
  userSetting(@Param('id') id: number, @Body() body: UpdateUserSettingDto) {
    return this.usersService.userSetting(id, body);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  destroyUser(@Param('id') id: number, @Req() req: any) {
    return this.usersService.destroy(id, req['user']['id']);
  }
}
