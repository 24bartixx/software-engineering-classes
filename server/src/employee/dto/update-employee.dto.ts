import { ApiProperty } from "@nestjs/swagger";
import {IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateEmployeeDto {
    @ApiProperty({ required: false, description: 'The date of employment' })
    @IsDateString()
    @IsOptional()
    employedAt?: Date;

    @ApiProperty({ required: false, description: 'The date of termination' })
    @IsDateString()
    @IsOptional()
    firedAt?: Date;

    @ApiProperty({ required: false, description: 'The user ID associated with the employee' })
    @IsNumber()
    @IsOptional()
    userId?: number;
}