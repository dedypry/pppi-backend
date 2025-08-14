import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'noreplypppi@gmail.com',
          pass: 'app-password-16-digit',
        },
      },
      defaults: {
        from: '"PPPI" <noreplypppi@gmail.com>',
      },
      template: {
        dir: join(process.cwd(), 'dist/apps/pppi-be-nest', 'views/emails'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
})
export class MailModule {}
