const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jobRoutes = require('./routes/jobRoutes');

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body parser middleware
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log('Incoming request:', {
    method: req.method,
    path: req.path,
    headers: req.headers,
    body: req.body
  });
  next();
});

// Routes
app.use('/api/locksmith', jobRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    success: false,
    error: err.message
  });
});

module.exports = app; 