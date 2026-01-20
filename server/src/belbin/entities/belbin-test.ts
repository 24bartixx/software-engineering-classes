import {Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('belbin_test')
export class BelbinTest {
    /*@PrimaryGeneratedColumn()
    id: number;

    @OneToOne()
    employeeId: number;

    @Column()
    performedAt: Date; // ???

    @Column()
    implementerScore: number;

    @Column()
    coordinatorScore: number;

    @Column()
    shaperScore: number;

    @Column()
    plantScore: number;

    @Column()
    resourceScore: number;

    @Column()
    monitorScore: number;

    @Column()
    teamworkerScore: number;

    @Column()
    completerScore: number;*/
}

/* TODO:
- employee (polaczony z User)
- employeeDepartment polaczony z employee
- department polaczony z employeeDepartment
- belbinTest polaczyc z employee
*/