const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const winston = require('winston');

// Load environment variables
dotenv.config();

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Environment check
logger.info('Job Service Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not Set',
  JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not Set'
});

// Import routes
const jobRoutes = require('./routes/jobRoutes');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => logger.info('Connected to MongoDB'))
  .catch(err => logger.error('MongoDB connection error:', err));

// Use routes
app.use('/api/jobs', jobRoutes);

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Job Service is running' });
});

// Root route redirect
app.get('/', (req, res) => {
  res.redirect('/api/health');
});

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  logger.info(`Job Service running on port ${PORT}`);
}); 