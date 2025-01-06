const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const authenticateLocksmith = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No authentication token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'locksmith') {
      return res.status(403).json({ message: 'Access denied. Locksmith only.' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(401).json({ message: 'Invalid authentication token' });
  }
};

module.exports = {
  authenticateLocksmith
}; 