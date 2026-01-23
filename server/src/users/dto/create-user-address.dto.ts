import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserAddressDto {
  @ApiProperty({ description: 'Country of the address' })
  @IsString()
  country: string;

  @ApiProperty({
    required: false,
    description: 'State or province of the address',
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ description: 'Postal code of the address' })
  @IsString()
  postal_code: string;

  @ApiProperty({ description: 'City of the address' })
  @IsString()
  city: string;

  @ApiProperty({ description: 'Street name of the address' })
  @IsString()
  street: string;

  @ApiProperty({ description: 'Street number of the address' })
  @IsString()
  number: string;

  @ApiProperty({
    required: false,
    description: 'Apartment number of the address',
  })
  @IsOptional()
  @IsString()
  apartment?: string;
}
