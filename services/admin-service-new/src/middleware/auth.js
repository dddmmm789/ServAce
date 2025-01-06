const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Authentication failed', 
        error: 'No token provided' 
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user info to request
    req.user = {
      id: decoded.id,
      role: decoded.role,
      permissions: decoded.permissions || []
    };

    logger.debug('Auth successful', { userId: decoded.id, role: decoded.role });
    next();
  } catch (error) {
    logger.error('Auth error:', error);
    return res.status(401).json({ 
      message: 'Authentication failed', 
      error: error.message 
    });
  }
};

module.exports = authMiddleware; 