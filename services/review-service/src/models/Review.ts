import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Response } from './Response';
import { ReviewImage } from './ReviewImage';
import { ReviewMetrics } from './ReviewMetrics';

@Entity('reviews')
export class Review {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    job_id: string;

    @Column('uuid')
    customer_id: string;

    @Column('uuid')
    technician_id: string;

    @Column('int')
    rating: number;

    @Column('text')
    comment: string;

    @Column('varchar', { default: 'pending' })
    status: string; // 'pending', 'approved', 'flagged', 'removed'

    @OneToMany(() => Response, response => response.review)
    responses: Response[];

    @OneToMany(() => ReviewImage, image => image.review)
    images: ReviewImage[];

    @OneToOne(() => ReviewMetrics, metrics => metrics.review)
    metrics: ReviewMetrics;

    @Column('jsonb', { nullable: true })
    service_details: {
        service_type?: string;
        service_date?: Date;
        location?: string;
        cost?: number;
    };

    @Column('boolean', { default: false })
    is_verified_purchase: boolean;

    @Column('boolean', { default: false })
    is_edited: boolean;

    @Column('timestamptz', { nullable: true })
    edited_at: Date;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    @Column('jsonb', { nullable: true })
    metadata: any;
} 