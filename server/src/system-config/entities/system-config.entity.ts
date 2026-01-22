import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('system_configuration')
export class SystemConfig {
    @PrimaryColumn({ name: 'key_name' })
    keyName: string;

    @Column()
    value: string;
}