import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { EmailService } from 'src/common/email.service';
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

  @Post('create-account')
  async createAccount(@Body() createUserDto: CreateUserAuthDto) {
    const email = createUserDto.email;

    // Check if user with the same email already exists
    const emailExists = await this.authService.emailExists(email);
    if (emailExists) {
      const isActivated = await this.authService.isActivated(email);
      if (isActivated) {
        throw new HttpException(
          'User with this email already exists',
          HttpStatus.CONFLICT,
        );
      } else {
        await this.authService.deleteUserByEmail(email);
      }
    }

    const token = jwt.sign({ email: email }, 'your-secret-key', {
      expiresIn: '3m',
    });

    await this.authService.createAccount(createUserDto, token);

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173/';
    await this.emailService.sendActivationEmail(
      email,
      `${clientUrl}activate-account?token=${token}`,
    );

    console.log('Token:', token);

    return { message: 'User created and activation email sent!' };
  }

  @Get('verify-activate-token')
  async verifyActivateToken(@Query('token') token: string) {
    if (!token) {
      throw new HttpException('Token is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const decoded = jwt.verify(token, 'your-secret-key') as { email: string };
      return {
        valid: true,
        expired: false,
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return {
          valid: false,
          expired: true,
        };
      }

      if (error instanceof jwt.JsonWebTokenError) {
        return {
          valid: false,
          expired: false,
        };
      }

      throw new HttpException(
        'Token verification failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('activate-account')
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
