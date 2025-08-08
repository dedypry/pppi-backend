import { Body, Controller, Delete, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import LoginDto from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Delete('logout')
  logoit(@Req() req: any) {
    const token = req?.headers?.authorization;
    return this.authService.logout(token);
  }
}
