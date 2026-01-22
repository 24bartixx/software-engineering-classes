import { IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBranchDto {
  @ApiProperty({ description: 'Is this branch the headquarters' })
  @IsBoolean()
  is_hq: boolean;

  @ApiProperty({ description: 'Address ID for this branch' })
  @IsNumber()
  address_id: number;
}
