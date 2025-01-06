import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import storageRoutes from './routes/storage';

const app = express();
const port = process.env.STORAGE_SERVICE_PORT || 3006;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'healthy' });
});

// Routes
app.use('/storage', storageRoutes);

// Error handling
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        code: err.code
    });
});

// Start server
app.listen(port, () => {
    console.log(`Storage service running on port ${port}`);
}); 