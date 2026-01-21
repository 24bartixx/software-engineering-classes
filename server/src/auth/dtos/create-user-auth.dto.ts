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

export class CreateUserAuthDto {
  @ApiProperty({ description: 'First name of the user' })
  @IsString()
  first_name: string;

  @ApiProperty({ description: 'Last name of the user' })
  @IsString()
  last_name: string;

  @ApiProperty({ description: 'Email of the user' })
  @IsEmail()
  email: string;

  @ApiProperty({ enum: Gender, description: 'Gender of the user' })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ description: 'Phone number of the user' })
  @IsString()
  phone_number: string;

  @ApiProperty({ description: 'Birthdate of the user in ISO format' })
  @IsDateString()
  birthday_date: string;

  @ApiProperty({ required: false, description: 'Address ID of the user' })
  @IsOptional()
  @IsNumber()
  address_id?: number;
}
