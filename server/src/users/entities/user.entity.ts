import { Exclude } from "class-transformer";
import { Address } from 'src/addresses/entities/address.entity';
import { Gender } from 'src/common/enum/gender.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  gender: Gender;

  @Column()
  phone_number: string;

  @Column()
  birthday_date: Date;

  @Column()
  isactivated: boolean;

  @Column({ type: 'varchar', nullable: true })
  @Exclude()
  verification_token?: string | null;

  @Column()
  created_at: Date;

  @Column()
  modified_at: Date;

  @Column({ nullable: true })
  address_id?: number | null;

  @ManyToOne(() => Address, { nullable: true })
  @JoinColumn({ name: 'address_id' })
  address?: Address | null;
}
