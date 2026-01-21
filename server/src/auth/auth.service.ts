import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserAuthDto } from './dtos/create-user-auth.dto';
import { VerifyAccountDto } from './dtos/verify-account.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createAccount(
    createUserDto: CreateUserAuthDto,
    verificationToken: string,
  ): Promise<User> {
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: '',
      isactivated: false,
      verification_token: verificationToken,
      created_at: new Date(),
      modified_at: new Date(),
      address_id: createUserDto.address_id ?? null,
    });
    return await this.usersRepository.save(newUser);
  }

  async verifyAccount(
    verifyAccountDto: VerifyAccountDto,
    email: string,
  ): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // In a real application I would hash the password before saving
    user.password = verifyAccountDto.password;
    user.isactivated = true;
    user.verification_token = null;
    user.modified_at = new Date();

    await this.usersRepository.save(user);
  }
}
