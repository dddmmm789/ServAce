import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Review } from './Review';

@Entity('review_responses')
export class Response {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Review, review => review.responses)
    review: Review;

    @Column('varchar')
    responder_id: string;

    @Column('varchar')
    responder_type: string; // 'technician', 'customer_service', 'admin'

    @Column('text')
    content: string;

    @Column('varchar', { default: 'active' })
    status: string; // 'active', 'archived', 'flagged'

    @Column('int', { default: 0 })
    helpful_votes: number;

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