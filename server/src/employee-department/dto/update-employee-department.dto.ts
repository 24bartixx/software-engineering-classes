import { ApiProperty } from "@nestjs/swagger";
import {IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateEmployeeDepartmentDto {
    @ApiProperty({ required: false, description: 'The start date of working in the department' })
    @IsDateString()
    @IsOptional()
    startedAt?: Date;

    @ApiProperty({ required: false, description: 'The end date of working in the department' })
    @IsDateString()
    @IsOptional()
    stoppedAt?: Date;
}