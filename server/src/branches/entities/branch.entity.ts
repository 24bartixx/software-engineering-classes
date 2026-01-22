import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Address } from '../../addresses/entities/address.entity';

@Entity('branch')
export class Branch {
  @PrimaryGeneratedColumn()
  branch_id: number;

  @Column()
  is_hq: boolean;

  @ManyToOne(() => Address)
  @JoinColumn({ name: 'address_id' })
  address: Address;
}
