import {Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('employee')
export class Employee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    employedAt: Date;

    @Column()
    firedAt: Date | null;
}