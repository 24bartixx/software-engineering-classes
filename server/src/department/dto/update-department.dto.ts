import { ApiProperty } from "@nestjs/swagger";
import {IsOptional, IsString } from "class-validator";

export class UpdateDepartmentDto {
    @ApiProperty({ required: false, description: 'The name of the department' })
    @IsString()
    @IsOptional()
    name?: string;
}