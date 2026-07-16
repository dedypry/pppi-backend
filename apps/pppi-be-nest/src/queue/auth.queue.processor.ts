import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { UserModel } from 'models/User.model';
import 'dotenv/config';
import { NotFoundException } from '@nestjs/common';
import * as dayjs from 'dayjs';

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
      } else {
        throw new NotFoundException('User tidak ada atau tidak aktif');
      }
    } catch (error) {
      console.error(error);
    }
  }

  @Process('send-email-verification')
  async handleSendEmailVerification(job: Job) {
    const { userId, token } = job.data;

    try {
      const user = await UserModel.query()
        .findById(userId)
        .withGraphFetched('profile');

      if (!user?.email || !token) {
        throw new NotFoundException('User tidak ditemukan');
      }

      await this.mailService.sendMail({
        to: user.email,
        template: './verify-email',
        subject: 'PPPI - Verifikasi Data Anggota PPPI',
        context: {
          name: user.name || '-',
          email: user.email || '-',
          nia: user.nia || '-',
          date_birth: dayjs().format('DD-MM-YYYY') || '-',
          address: user.profile?.address || '-',
          photo: user.profile?.photo || '',
          link: `${process.env.FRONT_WEB}/verify?token=${token}`,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
}
