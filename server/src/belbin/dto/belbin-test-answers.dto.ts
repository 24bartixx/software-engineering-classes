import { ApiProperty } from "@nestjs/swagger";
import {IsNotEmpty, IsNumber, IsObject } from "class-validator";

export class BelbinTestAnswersDto {
    @ApiProperty({ description: 'The ID of the employee who did the test' })
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @ApiProperty({
        description: 'Answers map: statement ID is the key (ex. "1a"), and points are the value',
        example: { "1a": 2, "1b": 8, "2a": 5, "2b": 5 }
    })
    @IsObject()
    @IsNotEmpty()
    answers: Record<string, number>;
}