import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { HrEmployee } from './hr-employee.entity';
import { ProjectManager } from './project-manager.entity';

@Entity()
export class Administrator {
  @PrimaryGeneratedColumn()
  administrator_id: number;

  @Column()
  hr_employee_id: number;

  @ManyToOne(() => HrEmployee)
  @JoinColumn({ name: 'hr_employee_id' })
  hrEmployee: HrEmployee;

  @Column()
  project_manager_id: number;

  @ManyToOne(() => ProjectManager)
  @JoinColumn({ name: 'project_manager_id' })
  projectManager: ProjectManager;
}
