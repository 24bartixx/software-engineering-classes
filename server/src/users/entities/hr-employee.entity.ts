import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Employee } from '../../employee/entities/employee.entity';

@Entity()
export class HrEmployee {
  @PrimaryGeneratedColumn()
  hr_employee_id: number;

  @Column()
  employee_id: number;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
}
