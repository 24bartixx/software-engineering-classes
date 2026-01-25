import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "../../employee/entities/employee.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity('belbin_test')
export class BelbinTest {
    @PrimaryGeneratedColumn({ name: 'belbin_test_id' })
    @ApiProperty({ description: 'The ID of the belbin test' })
    id: number;

    @OneToOne(() => Employee, (employee) => employee.belbinTest, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'employee_id' })
    employee: Employee;

    @Column({ name: 'performed_at' })
    @ApiProperty({ description: 'The test completion date' })
    performedAt: Date;

    @Column({ name: 'shaper_score', default: 0 })
    @ApiProperty({ description: 'The score of the shaper role' })
    shaperScore: number;

    @Column({ name: 'specialist_score', default: 0 })
    @ApiProperty({ description: 'The score of the specialist investigator role' })
    specialistScore: number;

    @Column({ name: 'plant_score', default: 0 })
    @ApiProperty({ description: 'The score of the plant role' })
    plantScore: number;

    @Column({ name: 'monitor_evaluator_score', default: 0 })
    @ApiProperty({ description: 'The score of the monitor evaluator role' })
    monitorEvaluatorScore: number;

    @Column({ name: 'completer_finisher_score', default: 0 })
    @ApiProperty({ description: 'The score of the completer finisher role' })
    completerFinisherScore: number;

    @Column({ name: 'resource_investigator_score', default: 0 })
    @ApiProperty({ description: 'The score of the resource investigator role' })
    resourceInvestigatorScore: number;

    @Column({ name: 'coordinator_score', default: 0 })
    @ApiProperty({ description: 'The score of the coordinator role' })
    coordinatorScore: number;

    @Column({ name: 'team_worker_score', default: 0 })
    @ApiProperty({ description: 'The score of the team worker role' })
    teamWorkerScore: number;

    @Column({ name: 'implementer_score', default: 0 })
    @ApiProperty({ description: 'The score of the implementer role' })
    implementerScore: number;
}