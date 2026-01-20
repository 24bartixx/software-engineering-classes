import {Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('employee_department')
export class EmployeeDepartment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    employeeId: number; // This should be a foreign key to the User entity

    @Column()
    departmentId: number; // This should be a foreign key to the Department entity

    @Column()
    startedAt: Date;

    @Column()
    stoppedAt: Date | null;
}