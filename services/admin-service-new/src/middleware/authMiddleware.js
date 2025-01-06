const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const logger = require('../utils/logger');

const authMiddleware = async (req, res, next) => {
  try {
    // Skip auth for service-to-service communication
    const serviceKey = req.headers['x-service-key'];
    if (serviceKey && serviceKey === process.env.SERVICE_KEY) {
      logger.info('Service-to-service authentication successful');
      return next();
    }

    // Regular JWT authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('No token provided or invalid token format');
      return res.status(401).json({ 
        message: 'Authentication required',
        error: 'No token provided' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      logger.warn('Token valid but admin not found:', decoded.id);
      return res.status(401).json({ 
        message: 'Authentication failed',
        error: 'Admin not found' 
      });
    }

    if (!admin.isActive) {
      logger.warn('Inactive admin attempted access:', decoded.id);
      return res.status(403).json({ 
        message: 'Access denied',
        error: 'Account is inactive' 
      });
    }

    // Add user info to request
    req.user = {
      id: admin._id,
      role: admin.role,
      permissions: admin.permissions
    };

    logger.info('Authentication successful:', {
      userId: admin._id,
      role: admin.role
    });

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      logger.warn('Invalid token provided');
      return res.status(401).json({ 
        message: 'Authentication failed',
        error: 'Invalid token' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      logger.warn('Expired token provided');
      return res.status(401).json({ 
        message: 'Authentication failed',
        error: 'Token expired' 
      });
    }

    logger.error('Auth middleware error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = authMiddleware; 