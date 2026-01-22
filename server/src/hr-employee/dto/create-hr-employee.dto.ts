import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateHrEmployeeDto {
  @ApiProperty({
    description: 'The employee ID associated with the HR employee',
  })
  @IsNumber()
  employeeId: number;
}
