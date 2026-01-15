import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('"user"') // 'user' to słowo zastrzeżone w Postgresie
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
  gender: string;

  @Column()
  isactivated: boolean;
}
