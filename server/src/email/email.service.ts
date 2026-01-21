import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendActivationEmail(email: string, activationLink: string) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'TeamBuilder - Account Activation',
      html: `<p>Click <a href="${activationLink}">here</a> to activate your account.</p>`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Activation email sent!');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
