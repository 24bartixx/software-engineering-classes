import {Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EmployeeDepartment } from "../../employee-department/entities/employee-department.entity";

@Entity('department')
export class Department {
    @PrimaryGeneratedColumn({ name: 'department_id' })
    id: number;

    @Column()
    name: string;

    @OneToMany(() => EmployeeDepartment, (ed) => ed.department)
    employeeDepartments: EmployeeDepartment[];
}