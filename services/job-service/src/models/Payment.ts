import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Job } from './Job';

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => Job, job => job.payment)
    @JoinColumn()
    job: Job;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column()
    status: string;

    @Column({ nullable: true })
    payment_method: string;

    @Column({ nullable: true })
    transaction_id: string;

    @Column({ nullable: true })
    receipt_url: string;

    @Column('jsonb', { nullable: true })
    payment_details: {
        card_last4?: string;
        card_brand?: string;
        payment_type?: string;
    };

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    @Column('jsonb', { nullable: true })
    metadata: any;
} 