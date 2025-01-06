import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Review } from './Review';

@Entity('review_metrics')
export class ReviewMetrics {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => Review, review => review.metrics)
    @JoinColumn()
    review: Review;

    @Column('int', { default: 0 })
    helpful_votes: number;

    @Column('int', { default: 0 })
    unhelpful_votes: number;

    @Column('int', { default: 0 })
    view_count: number;

    @Column('int', { default: 0 })
    response_count: number;

    @Column('int', { default: 0 })
    report_count: number;

    @Column('jsonb', { nullable: true })
    engagement_metrics: {
        time_spent_reading?: number;
        click_through_rate?: number;
        share_count?: number;
    };

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    @Column('jsonb', { nullable: true })
    metadata: any;
} 