import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { UserModel } from 'models/User.model';
import 'dotenv/config';
@Processor('AUTH-QUEUE')
export class AuthQueueProcessor {
  constructor(private readonly mailService: MailerService) {}

  @Process('forgot-password')
  async handleSendForgotPassword(job: Job) {
    const { userId } = job.data;

    try {
      const user = await UserModel.query().findById(userId);

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
        console.error('user not found');
      }
    } catch (error) {
      console.error(error);
    }
  }
}
