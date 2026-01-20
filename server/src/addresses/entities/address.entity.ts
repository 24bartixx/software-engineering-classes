import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  address_id: number;

  @Column()
  country: string;

  @Column({ nullable: true })
  state: string;

  @Column()
  postal_code: string;

  @Column()
  city: string;

  @Column()
  street: string;

  @Column()
  number: string;

  @Column({ nullable: true })
  apartment: string;
}
