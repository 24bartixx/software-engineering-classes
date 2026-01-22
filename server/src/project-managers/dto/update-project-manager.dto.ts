import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateProjectManagerDto {
  @ApiProperty({
    required: false,
    description: 'The employee ID associated with the project manager',
  })
  @IsNumber()
  @IsOptional()
  employeeId?: number;
}
