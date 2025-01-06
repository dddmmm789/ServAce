import { DataSource } from 'typeorm';
import { Review } from './Review';
import { Response } from './Response';
import { ReviewImage } from './ReviewImage';
import { ReviewMetrics } from './ReviewMetrics';
import 'dotenv/config';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'review_service',
    synchronize: false,
    logging: process.env.NODE_ENV !== 'production',
    entities: [Review, Response, ReviewImage, ReviewMetrics],
    migrations: [],
    subscribers: [],
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: true,
        ca: process.env.DB_CA_CERT
    } : false,
    extra: {
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    }
}); 