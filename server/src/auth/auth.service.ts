import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserAuthDto } from './dtos/create-user-auth.dto';
import { VerifyAccountDto } from './dtos/verify-account.dto';
import { AddressesService } from 'src/addresses/addresses.service';
import { CreateAddressDto } from 'src/addresses/dto/create-address.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private addressesService: AddressesService,
  ) {}

  async createAccount(
    createUserDto: CreateUserAuthDto,
    verificationToken: string,
  ): Promise<User> {
    // Create address only when all required address fields are present
    const hasAddressData =
      !!createUserDto.country &&
      !!createUserDto.postal_code &&
      !!createUserDto.city &&
      !!createUserDto.street &&
      !!createUserDto.number;

    let addressId: number | null = null;

    if (hasAddressData) {
      const addressData: CreateAddressDto = {
        country: createUserDto.country as string,
        postal_code: createUserDto.postal_code as string,
        city: createUserDto.city as string,
        street: createUserDto.street as string,
        number: createUserDto.number as string,
      };

      if (createUserDto.state) {
        addressData.state = createUserDto.state;
      }

      if (createUserDto.apartment) {
        addressData.apartment = createUserDto.apartment;
      }

      const address = await this.addressesService.create(addressData);
      addressId = address.address_id;
    }

    const newUser = this.usersRepository.create({
      first_name: createUserDto.first_name,
      last_name: createUserDto.last_name,
      email: createUserDto.email,
      gender: createUserDto.gender,
      phone_number: createUserDto.phone_number,
      birthday_date: createUserDto.birthday_date,
      password: '',
      isactivated: false,
      verification_token: verificationToken,
      created_at: new Date(),
      modified_at: new Date(),
      address_id: addressId,
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
