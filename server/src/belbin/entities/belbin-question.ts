import {Column, Entity, PrimaryGeneratedColumn } from "typeorm";

type Statement = {
    id: number;
    text: string;
    relatedRole: string;
}

@Entity('belbin_question')
export class BelbinQuestion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @Column()
    statements: string; // TODO - change to JSON type
}