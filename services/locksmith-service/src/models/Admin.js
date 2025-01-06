const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'admin'
  }
});

adminSchema.pre('save', async function(next) {
  try {
    if (this.isModified('password')) {
      logger.info('Hashing password for:', this.email);
      this.password = await bcrypt.hash(this.password, 10);
      logger.info('Password hashed successfully');
    }
    next();
  } catch (error) {
    logger.error('Password hashing error:', error);
    next(error);
  }
});

adminSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    logger.info('Comparing password for:', this.email);
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    logger.info('Password comparison result:', { isMatch });
    return isMatch;
  } catch (error) {
    logger.error('Password comparison error:', error);
    throw error;
  }
};

module.exports = mongoose.model('Admin', adminSchema); 