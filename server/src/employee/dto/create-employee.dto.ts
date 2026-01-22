import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNumber, IsOptional } from "class-validator";

export class CreateEmployeeDto {
    @ApiProperty({ description: 'The date of employment' })
    @IsDateString()
    employedAt: Date;

    @ApiProperty({ required: false, description: 'The date of termination' })
    @IsDateString()
    @IsOptional()
    firedAt?: Date;

    @ApiProperty({ description: 'The user ID associated with the employee' })
    @IsNumber()
    userId: number;
}