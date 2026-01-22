import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  employee_id: number;

  @Column({ type: 'timestamptz' })
  employed_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  fired_at?: Date | null;

  @Column()
  user_id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
