import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ServiceHistory } from './ServiceHistory';
import { Contact } from './Contact';
import { Location } from './Location';

@Entity('customers')
export class Customer {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true, nullable: true })
    email: string;

    @Column({ unique: true })
    phone: string;

    @Column({ default: 'active' })
    status: string;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    @OneToMany(() => Location, location => location.customer)
    locations: Location[];

    @OneToMany(() => Contact, contact => contact.customer)
    contacts: Contact[];

    @OneToMany(() => ServiceHistory, history => history.customer)
    serviceHistory: ServiceHistory[];

    @Column('jsonb', { nullable: true })
    metadata: any;
} 