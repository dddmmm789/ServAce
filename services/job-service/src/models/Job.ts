import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from 'typeorm';
import { Point } from 'geojson';
import { JobAssignment } from './JobAssignment';
import { JobStatus } from './JobStatus';
import { Payment } from './Payment';

@Entity('jobs')
export class Job {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    customer_id: string;

    @Column()
    service_type: string;

    @Column({ default: 'normal' })
    priority: string;

    @Column('timestamptz')
    scheduled_time: Date;

    @Column('interval')
    estimated_duration: string;

    @Column('geography', {
        spatialFeatureType: 'Point',
        srid: 4326
    })
    location: Point;

    @Column('jsonb')
    location_details: {
        address: string;
        unit?: string;
        floor?: string;
        access_code?: string;
        special_instructions?: string;
    };

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    price_estimate: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    final_price: number;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    notes: string;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    @OneToMany(() => JobAssignment, assignment => assignment.job)
    assignments: JobAssignment[];

    @OneToMany(() => JobStatus, status => status.job)
    status_history: JobStatus[];

    @OneToOne(() => Payment, payment => payment.job)
    payment: Payment;

    @Column('jsonb', { nullable: true })
    metadata: any;
} 