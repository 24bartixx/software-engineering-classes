import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "../../employee/entities/employee.entity";

@Entity('belbin_test')
export class BelbinTest {
    @PrimaryGeneratedColumn({ name: 'belbin_test_id' })
    id: number;

    @OneToOne(() => Employee, (employee) => employee.belbinTest, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'employee_id' })
    employee: Employee;

    @Column({ name: 'performed_at' })
    performedAt: Date;

    @Column({ name: 'shaper_score', default: 0 })
    shaperScore: number;

    @Column({ name: 'specialist_score', default: 0 })
    specialistScore: number;

    @Column({ name: 'plant_score', default: 0 })
    plantScore: number;

    @Column({ name: 'monitor_evaluator_score', default: 0 })
    monitorEvaluatorScore: number;

    @Column({ name: 'completer_finisher_score', default: 0 })
    completerFinisherScore: number;

    @Column({ name: 'resource_investigator_score', default: 0 })
    resourceInvestigatorScore: number;

    @Column({ name: 'coordinator_score', default: 0 })
    coordinatorScore: number;

    @Column({ name: 'team_worker_score', default: 0 })
    teamWorkerScore: number;

    @Column({ name: 'implementer_score', default: 0 })
    implementerScore: number;
}