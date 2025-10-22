import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('strings')
export class StringEntity {
    @PrimaryColumn()
    id: string; 

    @Column()
    value: string;

    @Column('jsonb')
    properties: object;

    @CreateDateColumn()
    created_at: Date;
}
