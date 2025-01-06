const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

// Routes
app.use('/api/reviews', reviewRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Start server
app.listen(config.PORT, () => {
    console.log(`Review service running on port ${config.PORT}`);
});

module.exports = app; 