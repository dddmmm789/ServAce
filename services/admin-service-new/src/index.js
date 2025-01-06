const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3009;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use Winston for HTTP logging instead of Morgan
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('HTTP Request', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`
    });
  });
  next();
});

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API Routes
const publicRoutes = require('./routes/publicRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const authMiddleware = require('./middleware/auth');

// Public routes (no auth required)
app.use('/api/admin', publicRoutes);

// Protected routes (auth required)
app.use('/api/admin', authMiddleware, protectedRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
    app.listen(PORT, () => {
      logger.info(`Admin service listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error);
  process.exit(1);
});

// Handle unhandled rejections
process.on('unhandledRejection', (error) => {
  logger.error('Unhandled rejection:', error);
  process.exit(1);
});

module.exports = app;