import { ConfigurationEnum } from '@configs/configurations.enum';
import { ConfigurationsService } from '@configs/configurations.service';
import { Injectable } from '@nestjs/common';
import { SendMailOptions } from 'nodemailer';
import * as nodeMailer from 'nodemailer';

@Injectable()
export class SendMailService {
  constructor(private readonly configurationService: ConfigurationsService) {}

  async sendMail({ mailTo, subject, content }: { mailTo: string; subject: string; content: string }) {
    const adminEmail = this.configurationService.get(ConfigurationEnum.ADMIN_EMAIL);
    const adminPassword = this.configurationService.get(ConfigurationEnum.ADMIN_EMAIL_PASSWORD);

    const transporter = nodeMailer.createTransport({
      service: 'gmail',
      secure: false, // use SSL - TLS
      auth: {
        user: adminEmail,
        pass: adminPassword,
      },
    });

    const email: SendMailOptions = {
      from: `Tuyen Luis <${adminEmail}>`,
      to: mailTo,
      subject: subject,
      html: content,
    };

    await transporter.sendMail(email);
  }
}
