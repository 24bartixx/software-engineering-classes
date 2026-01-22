import { Employee } from 'src/employee/entities/employee.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('hr_employee')
export class HrEmployee {
  @PrimaryGeneratedColumn({ name: 'hr_employee_id' })
  id: number;

  @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
}
