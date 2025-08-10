import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './domains/auth/auth.module';
import { BannersModule } from './domains/banners/banners.module';
import { AreaModule } from './domains/area/area.module';
import { RolesModule } from './domains/roles/roles.module';
import { MembersModule } from './domains/members/members.module';
import { BlogsModule } from './domains/blogs/blogs.module';
import { UsersModule } from './domains/users/users.module';
import { ProfileModule } from './domains/profile/profile.module';
import { SchedulersModule } from './domains/schedulers/schedulers.module';
import { MessagesModule } from './domains/messages/messages.module';

@Module({
  imports: [AuthModule, BannersModule, AreaModule, RolesModule, MembersModule, BlogsModule, UsersModule, ProfileModule, SchedulersModule, MessagesModule],
  controllers: [AppController],
})
export class AppModule {}
