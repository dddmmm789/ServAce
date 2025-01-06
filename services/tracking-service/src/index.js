require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const trackingRoutes = require('./routes/tracking');

const app = express();
const port = process.env.PORT || 3006;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
console.log('Attempting to connect to MongoDB...');
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Use routes with /api prefix
app.use('/api', trackingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        message: 'Internal server error',
        error: err.message 
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
