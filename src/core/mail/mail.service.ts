import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
    });

  async sendEmail(options: { to: string; subject: string; html: string }) {
    await this.transporter.sendMail({
      from: `"Mokami" <${process.env.MAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  }

  async sendVerificationEmail(to: string, token: string) {
    const url = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    await this.transporter.sendMail({
      from: `"Mokami App" <${process.env.MAIL_USER}>`,
      to,
      subject: 'Verify your email',
      html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`,
    });
  }
}

