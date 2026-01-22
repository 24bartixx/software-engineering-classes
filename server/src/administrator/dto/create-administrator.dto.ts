import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateAdministratorDto {
  @ApiProperty({
    description: 'The HR employee ID associated with the administrator',
  })
  @IsNumber()
  hrEmployeeId: number;

  @ApiProperty({
    description: 'The project manager ID associated with the administrator',
  })
  @IsNumber()
  projectManagerId: number;
}
