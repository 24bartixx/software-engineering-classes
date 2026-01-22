import { ApiProperty } from "@nestjs/swagger";
import {IsDateString, IsNumber, IsString } from "class-validator";

export class ExpiredBelbinTestDto {
    @ApiProperty({ description: 'The ID of the employee' })
    @IsNumber()
    employeeId: number;

    @ApiProperty({ description: 'The first name of the employee' })
    @IsString()
    firstName: string;

    @ApiProperty({ description: 'The last name of the employee' })
    @IsString()
    lastName: string;

    @ApiProperty({ description: 'The departments the employee belongs to', type: [String] })
    @IsString({ each: true })
    departments: string[];

    @ApiProperty({ description: 'The expiration date of the Belbin test' })
    @IsDateString()
    testExpirationDate: Date;
}