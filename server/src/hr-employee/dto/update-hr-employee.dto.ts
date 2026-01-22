import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateHrEmployeeDto {
  @ApiProperty({
    required: false,
    description: 'The employee ID associated with the HR employee',
  })
  @IsNumber()
  @IsOptional()
  employeeId?: number;
}
