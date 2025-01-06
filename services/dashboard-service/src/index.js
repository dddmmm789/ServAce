const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
const logger = require('./utils/logger');
const dashboardRoutes = require('./routes/dashboardRoutes');
const jwt = require('jsonwebtoken');
const DashboardStats = require('./models/DashboardStats');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Environment variables check
const envCheck = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  SERVICE_KEY: process.env.SERVICE_KEY ? 'Set' : 'Not Set',
  JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not Set',
  MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not Set'
};

logger.info('Dashboard Service Environment Check:', envCheck);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Dashboard Service is running',
    environment: process.env.NODE_ENV,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    logger.info('Dashboard Service: Connected to MongoDB');
  })
  .catch((error) => {
    logger.error('MongoDB connection error:', error);
  });

// WebSocket connection handling
io.on('connection', (socket) => {
  logger.info('Client connected:', socket.id);

  // Join admin room if authenticated
  socket.on('authenticate', (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role === 'admin') {
        socket.join('admin-dashboard');
        logger.info('Admin joined dashboard:', socket.id);
      }
    } catch (error) {
      logger.error('Socket authentication error:', error);
    }
  });

  // Handle stat updates
  socket.on('request-stats-update', async () => {
    try {
      const stats = await DashboardStats.findOne().sort({ date: -1 });
      if (stats) {
        socket.emit('stats-update', stats);
      }
    } catch (error) {
      logger.error('Socket stats error:', error);
    }
  });

  socket.on('disconnect', () => {
    logger.info('Client disconnected:', socket.id);
  });
});

// Routes
app.use('/api', dashboardRoutes);

const PORT = process.env.PORT || 3007;
server.listen(PORT, () => {
  logger.info(`Dashboard Service running on port ${PORT}`);
  logger.info('Service configuration:', { port: PORT, environment: process.env.NODE_ENV });
}); 