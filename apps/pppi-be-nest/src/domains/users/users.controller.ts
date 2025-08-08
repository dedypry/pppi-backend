import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import CheckEmailDto from './dto/check-mail.dto';
import { AuthGuard } from 'guard/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('check-email')
  checkMail(@Body() body: CheckEmailDto) {
    return this.usersService.checkEmail(body);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  destroyUser(@Param('id') id: number, @Req() req: any) {
    return this.usersService.destroy(id, req['user']['id']);
  }
}
