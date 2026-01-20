import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsEnum,
  IsDateString,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Gender } from 'src/common/gender.enum';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ required: false, description: 'First name of the user' })
  @IsOptional()
  @IsString()
  first_name?: string;

  @ApiProperty({ required: false, description: 'Last name of the user' })
  @IsOptional()
  @IsString()
  last_name?: string;

  @ApiProperty({ required: false, description: 'Email of the user' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false, description: 'Password of the user' })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({
    required: false,
    enum: Gender,
    description: 'Gender of the user',
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty({ required: false, description: 'Phone number of the user' })
  @IsOptional()
  @IsString()
  phone_number?: string;

  @ApiProperty({
    required: false,
    description: 'Birthdate of the user in ISO format',
  })
  @IsOptional()
  @IsDateString()
  birthday_date?: string;

  @ApiProperty({ required: false, description: 'Address ID of the user' })
  @IsOptional()
  @IsNumber()
  address_id?: number;
}
