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

export class EditUserAuthDto {
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

  @ApiProperty({
    required: false,
    description: 'List of department IDs to assign to the employee',
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  department_ids?: number[];

  @ApiProperty({
    required: false,
    description: 'List of branch IDs to assign to the employee',
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  branch_ids?: number[];
}
