import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { EmailService } from 'src/auth/email.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import * as jwt from 'jsonwebtoken';
import { CreateUserAuthDto } from './dtos/create-user-auth.dto';
import { VerifyAccountDto } from './dtos/verify-account.dto';

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
  async createAccount(@Body() createUserDto: CreateUserAuthDto) {
    const email = createUserDto.email;
    const token = jwt.sign({ email: email }, 'your-secret-key', {
      expiresIn: '10m',
    });

    this.authService.createAccount(createUserDto, token);

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173/';
    await this.emailService.sendActivationEmail(
      email,
      `${clientUrl}activate-account?token=${token}`,
    );

    console.log('URL sent:', `${clientUrl}activate-account?token=${token}`);
    console.log('Token:', token);

    return { message: 'User created and activation email sent!' };
  }

  @Post('verify-account')
  async verifyAndSetInitalPassword(
    @Query('token') token: string,
    @Body() verifyAccountDto: VerifyAccountDto,
  ) {
    if (verifyAccountDto.password !== verifyAccountDto.repeat_password) {
      throw new HttpException(
        'Passwords do not match!',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const decoded = jwt.verify(token, 'your-secret-key') as { email: string };
      await this.authService.verifyAccount(verifyAccountDto, decoded.email);
      return { message: `Account ${decoded.email} has been activated!` };
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        console.error('Token verification failed:', error);
        throw new HttpException(
          'Invalid or expired token!',
          HttpStatus.BAD_REQUEST,
        );
      }

      console.error('Something went wrong:', error);

      throw new HttpException(
        'Something went wrong during account verification!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
