import { ApiProperty } from "@nestjs/swagger";
import {IsBoolean, IsDateString, IsNumber, IsString } from "class-validator";

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
    firstName: string;

    @ApiProperty({ description: 'The last name of the employee' })
    @IsString()
    lastName: string;

    @ApiProperty({ description: 'The date when the Belbin test was taken' })
    @IsDateString()
    testDate: Date;

    @ApiProperty({ description: 'The results of the Belbin test', type: [Object] })
    results: BelbinCategoryResult[];

    @ApiProperty({ description: 'It indicates whether sending notifications is blocked or not. ' +
            'It is blocked when the notification was sent some time ago (the time is specified in the configuration) ' +
            'or the test expiration date is not close.' })
    @IsBoolean()
    isReminderBlocked: boolean;
}