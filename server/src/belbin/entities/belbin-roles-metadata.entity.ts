import {Column, Entity, PrimaryColumn } from "typeorm";

@Entity('belbin_roles_metadata')
export class BelbinRolesMetadata {
    @PrimaryColumn()
    property: string;

    @Column()
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;
}