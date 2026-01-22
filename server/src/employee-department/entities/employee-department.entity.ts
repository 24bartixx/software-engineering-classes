import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Employee } from "../../employee/entities/employee.entity";
import { Department } from "../../department/entities/department.entity";

@Entity('employee_department')
export class EmployeeDepartment {
    @PrimaryColumn({ name: 'employee_id' })
    employeeId: number;

    @PrimaryColumn({ name: 'department_id' })
    departmentId: number;

    @Column({ name: 'started_at' })
    startedAt: Date;

    @Column({ name: 'stopped_at', nullable: true })
    stoppedAt?: Date;

    @ManyToOne(() => Employee, (employee) => employee.departmentsHistory, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'employee_id'})
    employee: Employee;

    @ManyToOne(() => Department, (department) => department.employeeDepartments, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'department_id' })
    department: Department;
}