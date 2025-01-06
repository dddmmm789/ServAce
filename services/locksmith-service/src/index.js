const app = require('./app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3002;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://locksmith-db:27017/locksmith';

// Configure mongoose
mongoose.set('strictQuery', false);

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB at:', MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit on connection failure
  });

// Handle MongoDB connection events
mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Handle application termination
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  });
});