import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsEnum,
  IsDateString,
  IsOptional,
  IsArray,
  IsNumber,
} from 'class-validator';
import { Gender } from 'src/common/enum/gender.enum';
import { SystemRole } from 'src/common/enum/system-role.enum';

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

  @ApiProperty({ required: false, description: 'Country of the address' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({
    required: false,
    description: 'State or province of the address',
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ required: false, description: 'Postal code of the address' })
  @IsOptional()
  @IsString()
  postal_code?: string;

  @ApiProperty({ required: false, description: 'City of the address' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ enum: SystemRole, description: 'System role of the user' })
  @IsEnum(SystemRole)
  system_role: SystemRole;

  @ApiProperty({ required: false, description: 'Street name of the address' })
  @IsOptional()
  @IsString()
  street?: string;

  @ApiProperty({ required: false, description: 'Street number of the address' })
  @IsOptional()
  @IsString()
  number?: string;

  @ApiProperty({
    required: false,
    description: 'Apartment number of the address',
  })
  @IsOptional()
  @IsString()
  apartment?: string;

  @ApiProperty({
    required: false,
    description: 'List of department IDs to assign to the employee',
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  department_ids?: number[];
}
