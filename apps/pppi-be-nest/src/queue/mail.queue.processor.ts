import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { UserModel } from 'models/User.model';
import { getHtmlContent } from '../services/html-contect';
import { PdfService } from 'utils/services/pdf.service';

@Processor('MAIL-QUEUE')
export class MailQueueProcessor {
  constructor(
    private readonly mailService: MailerService,
    private readonly pdfService: PdfService,
  ) {}

  @Process('send-kta')
  async handleSendKta(job: Job) {
    const { userId } = job.data;
    try {
      const user = await UserModel.query()
        .findById(userId)
        .withGraphFetched('profile');

      if (user) {
        const html = await getHtmlContent('kta', { ...user });
        const buffer = await this.pdfService.downloadPdf({
          htmlContent: html,
          name: 'pdf of',
          landscape: true,
        });

        await this.mailService.sendMail({
          to: user.email,
          subject: 'selamat datang',
          template: './login',
          context: user,
          attachments: [
            {
              filename: `KTA-${user.name}.pdf`,
              content: buffer as any,
              contentType: 'application/pdf',
            },
          ],
        });

        console.log('SUCCESS SEND EMAIL = ', user.email);
      }
    } catch (error) {
      console.error('ERROR', error);
    }
  }
}
