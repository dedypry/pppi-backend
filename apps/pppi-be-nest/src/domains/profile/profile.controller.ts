import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from 'guard/auth.guard';
import { UpdatePasswordeDto, UpdatePhotoProfileDto, UpdateProfileDto } from './dto/update.dto';

@Controller('profile')
@UseGuards(AuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  myProfile(@Req() req: any) {
    return this.profileService.detail(req['user']['id']);
  }

  @Patch()
  updateProfile(@Body() body: UpdateProfileDto, @Req() req: any) {
    return this.profileService.updateProfile(body, req['user']['id']);
  }

  @Patch('/photo')
  updatePhotoProfile(@Body() body: UpdatePhotoProfileDto, @Req() req: any) {
    return this.profileService.updatePhotoProfile(body, req['user']['id']);
  }

  @Patch('/password')
  updatePassword(@Body() body: UpdatePasswordeDto, @Req() req: any) {
    return this.profileService.updatePassword(body, req['user']['id']);
  }
}
