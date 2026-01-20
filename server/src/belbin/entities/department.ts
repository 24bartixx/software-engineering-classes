import {Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('department')
export class Department {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}