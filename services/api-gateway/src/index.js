const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { logger } = require('./utils/logger');
const { authMiddleware } = require('./middleware/auth');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(logger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Routes
app.use('/api', routes);

// Service proxies
const services = {
  'admin-user': 'http://admin-user-service:3001',
  'locksmith-user': 'http://locksmith-user-service:3002',
  'admin-dashboard': 'http://admin-dashboard-service:3003',
  'locksmith-dashboard': 'http://locksmith-dashboard-service:3004',
  'tracking': 'http://tracking-service:3005',
  'review': 'http://review-service:3006',
  'communication': 'http://communication-service:3007'
};

// Setup proxy routes
Object.entries(services).forEach(([service, target]) => {
  app.use(
    `/api/${service}`,
    authMiddleware,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: {
        [`^/api/${service}`]: '',
      },
    })
  );
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
}); 