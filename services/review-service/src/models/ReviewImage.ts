import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Review } from './Review';

@Entity('review_images')
export class ReviewImage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Review, review => review.images)
    review: Review;

    @Column('varchar')
    url: string;

    @Column('varchar', { nullable: true })
    caption: string;

    @Column('varchar', { nullable: true })
    alt_text: string;

    @Column('int', { default: 0 })
    display_order: number;

    @Column('jsonb', { nullable: true })
    image_metadata: {
        size?: number;
        width?: number;
        height?: number;
        format?: string;
    };

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    @Column('jsonb', { nullable: true })
    metadata: any;
} 