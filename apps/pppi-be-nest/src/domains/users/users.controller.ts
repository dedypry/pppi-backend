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
import {
  ApproveVerificationDto,
  SendEmailVerificationDto,
  VerifyEmailDto,
  VerifyEmailSubmitDto,
} from './dto/email-verification.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get()
  list(@Query() query: PaginationDto) {
    query.page = query.page ? query.page - 1 : 0;
    return this.usersService.list(query);
  }

  @Post('check-email')
  checkMail(@Body() body: CheckEmailDto) {
    return this.usersService.checkEmail(body);
  }

  @UseGuards(AuthGuard)
  @Post('send-email-verification')
  sendEmailVerification(@Body() body: SendEmailVerificationDto) {
    return this.usersService.sendEmailVerification(body);
  }

  @Get('verify-email')
  getVerifyData(@Query() query: VerifyEmailDto) {
    return this.usersService.getVerifyData(query.token);
  }

  @Post('verify-email')
  submitVerification(@Body() body: VerifyEmailSubmitDto) {
    return this.usersService.submitVerification(body);
  }

  @UseGuards(AuthGuard)
  @Patch(':id/approve-verification')
  approveVerification(
    @Param('id') id: number,
    @Body() body: ApproveVerificationDto,
  ) {
    return this.usersService.approveVerification(id, body);
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
