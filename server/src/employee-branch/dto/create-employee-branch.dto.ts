import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional } from 'class-validator';

export class CreateEmployeeBranchDto {
  @ApiProperty({ description: 'The employee ID associated with the branch' })
  @IsNumber()
  employeeId: number;

  @ApiProperty({ description: 'The branch ID associated with the employee' })
  @IsNumber()
  branchId: number;

  @ApiProperty({ description: 'The start date of working in the branch' })
  @IsDateString()
  startedAt: Date;

  @ApiProperty({
    required: false,
    description: 'The end date of working in the branch',
  })
  @IsDateString()
  @IsOptional()
  stoppedAt?: Date;
}
