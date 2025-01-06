const express = require('express');
const router = express.Router();
const publicRoutes = require('./publicRoutes');
const protectedRoutes = require('./protectedRoutes');
const authMiddleware = require('../middleware/authMiddleware');
const logger = require('../utils/logger');

// Global route logging
router.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`, {
    query: req.query,
    body: req.method === 'POST' || req.method === 'PUT' ? req.body : undefined
  });
  next();
});

// Mount routes
router.use('/', publicRoutes);
router.use('/', authMiddleware, protectedRoutes);

// 404 handler
router.use((req, res) => {
  logger.warn('Route not found:', req.originalUrl);
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
router.use((err, req, res, next) => {
  logger.error('Route error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = router; 