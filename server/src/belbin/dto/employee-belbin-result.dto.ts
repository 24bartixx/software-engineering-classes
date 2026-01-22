import { ApiProperty } from "@nestjs/swagger";
import {IsDateString, IsNumber, IsString } from "class-validator";

export class BelbinCategoryResult {
    @ApiProperty({ description: 'The ID of the Belbin category' })
    @IsString()
    id: string;

    @ApiProperty({ description: 'The name of the Belbin category' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'The score achieved in this Belbin category' })
    @IsNumber()
    score: number;

    @ApiProperty({ description: 'A brief description of the Belbin category' })
    @IsString()
    description: string;
}

export class EmployeeBelbinResultDto {
    @ApiProperty({ description: 'The ID of the employee' })
    @IsNumber()
    employeeId: number;

    @ApiProperty({ description: 'The first name of the employee' })
    @IsString()
    employeeFirstName: string;

    @ApiProperty({ description: 'The last name of the employee' })
    @IsString()
    employeeLastName: string;

    @ApiProperty({ description: 'The date when the Belbin test was taken' })
    @IsDateString()
    testDate: Date;

    @ApiProperty({ description: 'The results of the Belbin test', type: [Object] })
    results: BelbinCategoryResult[];
}