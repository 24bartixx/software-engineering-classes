import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from 'src/users/entities/user.entity';
import { EmailService } from './email.service';
import { AddressesModule } from 'src/addresses/addresses.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AddressesModule],
  controllers: [AuthController],
  providers: [AuthService, EmailService],
})
export class AuthModule {}
