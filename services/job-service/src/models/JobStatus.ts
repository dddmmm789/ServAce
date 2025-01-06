import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Job } from './Job';

@Entity('job_status_history')
export class JobStatus {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Job, job => job.status_history)
    job: Job;

    @Column()
    status: string;

    @Column({ nullable: true })
    reason: string;

    @Column({ nullable: true })
    notes: string;

    @Column('uuid', { nullable: true })
    changed_by: string;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @Column('jsonb', { nullable: true })
    metadata: any;
} 