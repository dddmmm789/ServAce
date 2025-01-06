const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      logger.error('No Authorization header');
      return res.status(401).json({ message: 'Authentication failed - No token' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      logger.error('No token in Authorization header');
      return res.status(401).json({ message: 'Authentication failed - Invalid header format' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    logger.info(`Authenticated user: ${decoded.id}`);
    req.locksmith = decoded;
    next();
  } catch (error) {
    logger.error('Auth error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
}; 