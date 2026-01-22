import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class UpdateEmployeeBranchDto {
  @ApiProperty({
    required: false,
    description: 'The start date of working in the branch',
  })
  @IsDateString()
  @IsOptional()
  startedAt?: Date;

  @ApiProperty({
    required: false,
    description: 'The end date of working in the branch',
  })
  @IsDateString()
  @IsOptional()
  stoppedAt?: Date;
}
