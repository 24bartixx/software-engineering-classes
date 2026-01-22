import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateAdministratorDto {
  @ApiProperty({
    required: false,
    description: 'The HR employee ID associated with the administrator',
  })
  @IsNumber()
  @IsOptional()
  hrEmployeeId?: number;

  @ApiProperty({
    required: false,
    description: 'The project manager ID associated with the administrator',
  })
  @IsNumber()
  @IsOptional()
  projectManagerId?: number;
}
