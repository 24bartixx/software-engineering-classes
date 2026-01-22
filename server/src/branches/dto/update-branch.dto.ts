import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { CreateBranchDto } from './create-branch.dto';

export class UpdateBranchDto extends PartialType(CreateBranchDto) {
  @ApiProperty({
    required: false,
    description: 'Is this branch the headquarters',
  })
  @IsOptional()
  @IsBoolean()
  is_hq?: boolean;

  @ApiProperty({ required: false, description: 'Address ID for this branch' })
  @IsOptional()
  @IsNumber()
  address_id?: number;
}
