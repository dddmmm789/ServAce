import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Customer } from './Customer';
import { Point } from 'geojson';

@Entity('locations')
export class Location {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Customer, customer => customer.locations)
    customer: Customer;

    @Column('geography', {
        spatialFeatureType: 'Point',
        srid: 4326
    })
    point: Point;

    @Column('jsonb')
    address: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
        formatted: string;
    };

    @Column({ default: true })
    is_primary: boolean;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    @Column('jsonb', { nullable: true })
    metadata: any;
} 