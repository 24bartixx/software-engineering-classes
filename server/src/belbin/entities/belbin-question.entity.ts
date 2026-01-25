import { ApiProperty } from "@nestjs/swagger";
import {Column, Entity, PrimaryGeneratedColumn } from "typeorm";

class Statement {
    @ApiProperty({ description: 'The ID of the statement '})
    id: string;

    @ApiProperty({ description: 'The content of the statement' } )
    text: string;

    @ApiProperty({ description: 'The field name related to the role with which this statement is associated'})
    relatedRoleFieldName: string;
}

@Entity('belbin_question')
export class BelbinQuestion {
    @PrimaryGeneratedColumn({ name: 'belbin_question_id' })
    @ApiProperty({ description: 'The ID of the belbin question' })
    id: number;

    @Column()
    @ApiProperty({ description: 'It is main content of the question' })
    content: string;

    @Column({ type: 'jsonb' })
    @ApiProperty({ description: 'The list of statements', type: Statement, isArray: true })
    statements: Statement[];
}