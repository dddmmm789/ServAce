import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Job } from './Job';

@Entity('job_assignments')
export class JobAssignment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Job, job => job.assignments)
    job: Job;

    @Column('uuid')
    technician_id: string;

    @Column({ default: 'assigned' })
    status: string;

    @Column('timestamptz', { nullable: true })
    accepted_at: Date;

    @Column('timestamptz', { nullable: true })
    started_at: Date;

    @Column('timestamptz', { nullable: true })
    completed_at: Date;

    @Column({ nullable: true })
    notes: string;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    @Column('jsonb', { nullable: true })
    metadata: any;
} 