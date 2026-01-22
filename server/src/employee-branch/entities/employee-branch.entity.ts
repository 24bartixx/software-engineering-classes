import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Employee } from '../../employee/entities/employee.entity';
import { Branch } from '../../branches/entities/branch.entity';

@Entity('employee_branch')
export class EmployeeBranch {
  @PrimaryColumn({ name: 'employee_id' })
  employeeId: number;

  @PrimaryColumn({ name: 'branch_id' })
  branchId: number;

  @Column({ name: 'started_at' })
  startedAt: Date;

  @Column({ name: 'stopped_at', nullable: true })
  stoppedAt?: Date;

  @ManyToOne(() => Employee, (employee) => employee.branchesHistory, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ManyToOne(() => Branch, (branch) => branch.employeeBranches, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;
}
