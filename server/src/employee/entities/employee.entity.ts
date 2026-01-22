import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmployeeDepartment } from '../../employee-department/entities/employee-department.entity';
import { BelbinTest } from '../../belbin/entities/belbin-test.entity';

@Entity('employee')
export class Employee {
  @PrimaryGeneratedColumn({ name: 'employee_id' })
  id: number;

  @Column({
    name: 'employed_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  employedAt: Date;

  @Column({ name: 'fired_at', nullable: true })
  firedAt?: Date;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => BelbinTest, (belbinTest) => belbinTest.employee)
  belbinTest: BelbinTest;

  @OneToMany(() => EmployeeDepartment, (ed) => ed.employee)
  departmentsHistory: EmployeeDepartment[];
}
