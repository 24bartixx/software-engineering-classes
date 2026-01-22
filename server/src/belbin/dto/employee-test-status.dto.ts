import { ApiProperty } from '@nestjs/swagger';

export enum BelbinTestStatus {
    NOT_STARTED = 'not_started',
    COMPLETED = 'completed',
    EXPIRED = 'expired',
}

export class EmployeeTestStatusDto {
    @ApiProperty({ description: 'The ID of the employee' })
    id: number;

    @ApiProperty({ description: 'Full name of the employee' })
    name: string;

    @ApiProperty({ enum: BelbinTestStatus, description: 'Status of the Belbin test' })
    status: BelbinTestStatus;

    @ApiProperty({ description: 'Date of the last performed test', nullable: true })
    lastTestDate: Date | null;
}