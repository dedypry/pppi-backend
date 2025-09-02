import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { UserModel } from 'models/User.model';
import 'dotenv/config';
import { NotFoundException } from '@nestjs/common';
@Processor('AUTH-QUEUE')
export class AuthQueueProcessor {
  constructor(private readonly mailService: MailerService) {}

  @Process('forgot-password')
  async handleSendForgotPassword(job: Job) {
    const { userId } = job.data;

    try {
      const user = await UserModel.query()
        .where('id', userId)
        .where('is_active', true)
        .where('status', 'approved')
        .first();

      if (user) {
        await this.mailService.sendMail({
          to: user.email,
          template: './forgot-password',
          subject: 'PPPI - Lupa Password',
          context: {
            name: user?.name,
            link: `${process.env.FRONT_WEB}/reset-password/${user?.token}`,
          },
        });
        console.log('SUCCESS SEND EMAIL = ', user?.email);
      } else {
        throw new NotFoundException('User tidak ada atau tidak aktif');
      }
    } catch (error) {
      console.error(error);
    }
  }
}
