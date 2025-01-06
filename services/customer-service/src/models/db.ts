import { DataSource } from 'typeorm';
import { Customer } from './Customer';
import { Location } from './Location';
import { Contact } from './Contact';
import { ServiceHistory } from './ServiceHistory';

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    entities: [Customer, Location, Contact, ServiceHistory],
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
}); 