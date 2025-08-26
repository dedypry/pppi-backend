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
import { BlogCommentsModule } from './domains/blog-comments/blog-comments.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { fnHandlebar } from './services/handlebars';
import { PdfService } from 'utils/services/pdf.service';
import { DashboardModule } from './domains/dashboard/dashboard.module';
import { OrganizationsModule } from './domains/organizations/organizations.module';
import { AppsModule } from './domains/apps/apps.module';
import { PackagesModule } from './domains/packages/packages.module';
import { FormModule } from './domains/form/form.module';
import BullConfig from 'utils/modules/BullConfig.module';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'dpn.p3i@gmail.com',
          pass: 'hilnzuetqqwdklez',
        },
        // auth: {
        //   user: 'noreplypppi@gmail.com',
        //   pass: 'lncwetstxghdrmsc',
        // },
        tls: {
          rejectUnauthorized: false,
        },
        connectionTimeout: 10000,
      },

      defaults: {
        from: '"PPPI" <noreplypppi@gmail.com>',
      },
      template: {
        dir: join(process.cwd(), 'dist/apps/pppi-be-nest', 'views/emails'),
        adapter: new HandlebarsAdapter(fnHandlebar),
        options: {
          strict: true,
        },
      },
    }),
    BullConfig,
    AuthModule,
    BannersModule,
    AreaModule,
    RolesModule,
    MembersModule,
    BlogsModule,
    UsersModule,
    ProfileModule,
    SchedulersModule,
    MessagesModule,
    BlogCommentsModule,
    DashboardModule,
    OrganizationsModule,
    AppsModule,
    PackagesModule,
    FormModule,
  ],
  controllers: [AppController],
  providers: [PdfService],
})
export class AppModule {}
