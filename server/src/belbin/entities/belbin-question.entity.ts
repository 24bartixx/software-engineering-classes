import {Column, Entity, PrimaryGeneratedColumn } from "typeorm";

type Statement = {
    id: string;
    text: string;
    relatedRole: string;
}

@Entity('belbin_question')
export class BelbinQuestion {
    @PrimaryGeneratedColumn({ name: 'belbin_question_id' })
    id: number;

    @Column()
    content: string;

    @Column({ type: 'jsonb' })
    statements: Statement[];
}