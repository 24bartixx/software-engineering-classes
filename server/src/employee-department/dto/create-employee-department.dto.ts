import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNumber, IsOptional } from "class-validator";

export class CreateEmployeeDepartmentDto {
    @ApiProperty({ description: "The employee ID associated with the department" })
    @IsNumber()
    employeeId: number;

    @ApiProperty({ description: 'The department ID associated with the employee' })
    @IsNumber()
    departmentId: number;

    @ApiProperty({ description: 'The start date of working in the department' })
    @IsDateString()
    startedAt: Date;

    @ApiProperty({ required: false, description: 'The end date of working in the department' })
    @IsDateString()
    @IsOptional()
    stoppedAt?: Date;
}