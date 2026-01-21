import { Controller, Post } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send-activation-email')
  async sendActivationEmail() {
    const email = 'jestgitbartix@gmail.com';
    const activationLink = 'http://localhost:3000/activate?token=randomToken';

    await this.emailService.sendActivationEmail(email, activationLink);
    return { message: 'Activation email sent!' };
  }
}
