import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Customer } from './Customer';

@Entity('service_history')
export class ServiceHistory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Customer, customer => customer.serviceHistory)
    customer: Customer;

    @Column('uuid')
    job_id: string;

    @Column('uuid')
    technician_id: string;

    @Column()
    service_type: string;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column('timestamptz')
    service_date: Date;

    @Column({ nullable: true })
    notes: string;

    @Column('int', { nullable: true })
    rating: number;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    @Column('jsonb', { nullable: true })
    metadata: any;
} 