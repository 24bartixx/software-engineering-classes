import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Address } from '../../addresses/entities/address.entity';
import { EmployeeBranch } from '../../employee-branch/entities/employee-branch.entity';

@Entity('branch')
export class Branch {
  @PrimaryGeneratedColumn()
  branch_id: number;

  @Column()
  is_hq: boolean;

  @ManyToOne(() => Address)
  @JoinColumn({ name: 'address_id' })
  address: Address;

  @OneToMany(() => EmployeeBranch, (eb) => eb.branch)
  employeeBranches: EmployeeBranch[];
}
