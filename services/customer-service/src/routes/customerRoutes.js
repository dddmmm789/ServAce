const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { authenticateCustomer } = require('../middleware/auth');
const { authenticateLocksmith } = require('../middleware/locksmithAuth');
const Customer = require('../models/Customer');
const geocodeAddress = require('../utils/geocodeAddress');
const generateTrackingId = require('../utils/generateTrackingId');
const logger = require('../utils/logger');

// Public routes
router.post('/register', customerController.register);
router.post('/login', customerController.login);

// Protected routes
router.get('/profile', authenticateCustomer, customerController.getProfile);
router.put('/profile', authenticateCustomer, customerController.updateProfile);
router.get('/api/stats', customerController.getStats);

// Add new route for locksmith-created customers
router.post('/api/customers/quick-create', authenticateLocksmith, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    
    // Generate a unique tracking ID for the customer
    const trackingId = generateTrackingId();
    
    // Check if customer exists by phone (if provided)
    let customer = null;
    if (phone) {
      customer = await Customer.findOne({ phone });
    }
    
    if (!customer) {
      // Create new customer with minimal required fields
      customer = new Customer({
        name: name || 'Anonymous Customer',
        phone,
        location: address ? await geocodeAddress(address) : undefined,
        trackingId,
        createdBy: {
          locksmithId: req.locksmith.id,
          type: 'locksmith'
        },
        status: 'active',
        type: 'anonymous' // Distinguish from registered customers
      });
      
      await customer.save();
    }
    
    return res.status(200).json({
      success: true,
      customer: {
        id: customer._id,
        trackingId,
        name: customer.name,
        phone: customer.phone,
        location: customer.location
      }
    });
    
  } catch (error) {
    logger.error('Error creating quick customer:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error creating customer'
    });
  }
});

module.exports = router; 