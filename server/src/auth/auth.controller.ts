import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from 'src/auth/email.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import * as jwt from 'jsonwebtoken';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly emailService: EmailService,
    private readonly authService: AuthService,
  ) {}

  @Post('send-activation-email')
  async sendActivationEmail() {
    const email = 'jestgitbartix@gmail.com';
    const activationLink = 'http://localhost:3000/activate?token=randomToken';

    await this.emailService.sendActivationEmail(email, activationLink);
    return { message: 'Activation email sent!' };
  }

  @Post('create-account')
  async createAccount(@Body() createUserDto: CreateUserDto) {

    const email = createUserDto.email;
    const token = jwt.sign({ email: email }, 'your-secret-key', {
      expiresIn: '10m',
    });

    this.authService.createAccount(createUserDto, token);

    const activationLink = `http://localhost:3000/activate?token=${token}`;

    await this.emailService.sendActivationEmail(email, activationLink);

    return { message: 'User created and activation email sent!' };
  }

  @Post('verify-account')
  async verifyAccount() {}
}
