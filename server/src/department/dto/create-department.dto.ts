import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateDepartmentDto {
    @ApiProperty({ description: 'The name of the department' })
    @IsString()
    name: string;
}