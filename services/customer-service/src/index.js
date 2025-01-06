const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Add environment check logging
console.log('Customer Service Environment Check:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  SERVICE_KEY: process.env.SERVICE_KEY ? 'Set' : 'Not Set',
  JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not Set',
  MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not Set',
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY ? 'Set' : 'Not Set'
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`, {
    headers: req.headers,
    body: req.method === 'POST' ? req.body : undefined
  });
  next();
});

// Routes
const customerRoutes = require('./routes/customerRoutes');
app.use('/api/customers', customerRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Customer Service is running',
    environment: process.env.NODE_ENV,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Customer Service Error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 3003;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Customer Service: Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Customer Service running on port ${PORT}`);
      console.log('Service configuration:', {
        port: PORT,
        environment: process.env.NODE_ENV
      });
    });
  })
  .catch(err => {
    console.error('Customer Service MongoDB connection error:', err);
    process.exit(1);
  }); 