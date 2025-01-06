const mongoose = require('mongoose');
const Locksmith = require('../src/models/Locksmith');
require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env' : '.env.local'
});

async function createTestUser() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27022/locksmith-service';
  
  try {
    console.log('Connecting to MongoDB...', MONGODB_URI);
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
    
    // Check if test user already exists
    const existingUser = await Locksmith.findOne({ email: 'test@locksmith.com' });
    if (existingUser) {
      console.log('Test user already exists');
      await mongoose.disconnect();
      process.exit(0);
    }

    const testUser = new Locksmith({
      name: 'Test Locksmith',
      email: 'test@locksmith.com',
      password: 'password123',
      phone: '1234567890',
      status: 'active'
    });

    await testUser.save();
    console.log('Test user created successfully');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    if (!mongoose.connection.readyState) {
      console.error('MongoDB connection failed. Make sure MongoDB is running and the connection string is correct.');
    }
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection:', error);
  process.exit(1);
});

createTestUser(); 