const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const reviewRoutes = require('./routes/reviewRoutes');
const logger = require('./utils/logger');

const app = express();

app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api', reviewRoutes);  // Add /api prefix

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 3003;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://review-db:27017/review-service';

mongoose.connect(MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
    app.listen(PORT, () => {
      logger.info(`Review service running on port ${PORT}`);
    });
  })
  .catch(err => {
    logger.error('MongoDB connection error:', err);
    process.exit(1);
  }); 