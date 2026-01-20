import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { CreateAddressDto } from './create-address.dto';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {
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
}
