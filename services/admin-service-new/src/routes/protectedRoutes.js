const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const locksmithController = require('../controllers/locksmithController');
const logger = require('../utils/logger');
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Locksmith = require('../models/Locksmith');

// Debug middleware for protected routes
router.use((req, res, next) => {
  logger.info('Protected Route Request:', {
    path: req.path,
    method: req.method,
    userId: req.user?.id
  });
  next();
});

// Admin profile routes
router.get('/profile', adminController.getProfile);
router.put('/profile', adminController.updateProfile);

// System routes
router.get('/system/status', async (req, res) => {
  try {
    const stats = {
      status: 'operational',
      timestamp: new Date(),
      database: {
        status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        collections: {
          admins: await Admin.countDocuments()
        }
      },
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV
    };

    res.json(stats);
  } catch (error) {
    console.error('System status error:', error);
    res.status(500).json({
      message: 'Error fetching system status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Locksmith management routes
router.get('/locksmiths', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Locksmith.countDocuments();
    const locksmiths = await Locksmith.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);

    res.json({
      locksmiths,
      total,
      page,
      totalPages,
      hasMore: page < totalPages
    });
  } catch (error) {
    logger.error('Error fetching locksmiths:', error);
    res.status(500).json({ 
      message: 'Error fetching locksmiths',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get specific locksmith
router.get('/locksmiths/:id', async (req, res) => {
  try {
    const locksmith = await Locksmith.findOne({ locksmithId: req.params.id });
    if (!locksmith) {
      return res.status(404).json({ message: 'Locksmith not found' });
    }
    res.json(locksmith);
  } catch (error) {
    logger.error('Error fetching locksmith:', error);
    res.status(500).json({ 
      message: 'Error fetching locksmith',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update locksmith status
router.put('/locksmiths/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const locksmithId = req.params.id;

    // Validate status
    const validStatuses = ['pending', 'active', 'suspended', 'inactive'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status',
        validStatuses 
      });
    }

    // Find and update locksmith
    const locksmith = await Locksmith.findOneAndUpdate(
      { locksmithId },
      { 
        status,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!locksmith) {
      return res.status(404).json({ message: 'Locksmith not found' });
    }

    logger.info('Locksmith status updated', { locksmithId, status });
    res.json({ 
      message: 'Locksmith status updated successfully',
      locksmith 
    });
  } catch (error) {
    logger.error('Error updating locksmith status:', error);
    res.status(500).json({ 
      message: 'Error updating locksmith status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Sync endpoint (requires service key)
router.post('/sync/locksmith', async (req, res) => {
  try {
    const {
      locksmithId,
      username,
      email,
      businessName,
      phone,
      address,
      city,
      state,
      zip,
      status
    } = req.body;

    // Check if locksmith already exists
    let locksmith = await Locksmith.findOne({ locksmithId });

    if (locksmith) {
      // Update existing locksmith
      locksmith = await Locksmith.findOneAndUpdate(
        { locksmithId },
        {
          username,
          email,
          businessName,
          phone,
          address,
          city,
          state,
          zip,
          status,
          updatedAt: new Date()
        },
        { new: true }
      );
    } else {
      // Create new locksmith
      locksmith = new Locksmith({
        locksmithId,
        username,
        email,
        businessName,
        phone,
        address,
        city,
        state,
        zip,
        status
      });
      await locksmith.save();
    }

    logger.info('Locksmith synced successfully', { locksmithId });
    res.json({ message: 'Locksmith synced successfully', locksmith });
  } catch (error) {
    logger.error('Error syncing locksmith:', error);
    res.status(500).json({ 
      message: 'Error syncing locksmith',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router; 