const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const logger = require('../utils/logger');

// Debug middleware for public routes
router.use((req, res, next) => {
  logger.info('Public Route Request:', {
    path: req.path,
    method: req.method
  });
  next();
});

// Authentication routes
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    logger.debug('Login attempt details:', { 
      username,
      passwordLength: password ? password.length : 0
    });

    // Find admin by username
    const admin = await Admin.findOne({ username });
    logger.debug('Found admin:', { 
      found: !!admin,
      adminId: admin?._id,
      hasPassword: !!admin?.password
    });

    if (!admin) {
      logger.warn(`Login failed: Admin not found for username: ${username}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, admin.password);
    logger.debug('Password comparison result:', { isMatch });

    if (!isMatch) {
      logger.warn(`Login failed: Invalid password for username: ${username}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Create token
    const token = jwt.sign(
      { 
        id: admin._id,
        role: admin.role,
        permissions: admin.permissions || []
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    logger.info(`Login successful for username: ${username}`);
    res.json({
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ 
      message: 'Error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ 
      $or: [{ username }, { email }] 
    });
    
    if (existingAdmin) {
      return res.status(400).json({ 
        message: 'Username or email already exists' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin
    const admin = new Admin({
      username,
      password: hashedPassword,
      email,
      role: 'admin'
    });

    await admin.save();

    logger.info(`New admin registered: ${username}`);
    res.status(201).json({
      message: 'Admin user created successfully',
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Error creating admin user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router; 