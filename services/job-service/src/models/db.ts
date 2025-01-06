import { DataSource } from 'typeorm';
import { Job } from './Job';
import { JobAssignment } from './JobAssignment';
import { JobStatus } from './JobStatus';
import { Payment } from './Payment';

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    entities: [Job, JobAssignment, JobStatus, Payment],
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
}); 