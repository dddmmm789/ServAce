import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Customer } from './Customer';

@Entity('contacts')
export class Contact {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Customer, customer => customer.contacts)
    customer: Customer;

    @Column()
    name: string;

    @Column()
    relationship: string;

    @Column({ nullable: true })
    email: string;

    @Column()
    phone: string;

    @Column({ default: false })
    is_emergency_contact: boolean;

    @Column({ default: false })
    is_authorized_contact: boolean;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    @Column('jsonb', { nullable: true })
    metadata: any;
} 