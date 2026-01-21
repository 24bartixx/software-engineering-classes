import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createAccount(
    createUserDto: CreateUserDto,
    verificationToken: string,
  ): Promise<User> {
    const newUser = this.usersRepository.create({
      ...createUserDto,
      isactivated: false,
      verification_token: verificationToken,
      created_at: new Date(),
      modified_at: new Date(),
    });
    return await this.usersRepository.save(newUser);
  }
}
