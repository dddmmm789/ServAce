const logger = require('../utils/logger');

const checkPermissions = (requiredPermissions) => {
  return (req, res, next) => {
    try {
      // Super admins bypass permission checks
      if (req.user.role === 'super_admin') {
        return next();
      }

      // Check if user has all required permissions
      const hasPermissions = Array.isArray(requiredPermissions)
        ? requiredPermissions.every(permission => 
            req.user.permissions.includes(permission)
          )
        : req.user.permissions.includes(requiredPermissions);

      if (!hasPermissions) {
        logger.warn('Permission denied:', {
          userId: req.user.id,
          required: requiredPermissions,
          actual: req.user.permissions
        });
        
        return res.status(403).json({ 
          message: 'Permission denied',
          error: 'Insufficient permissions' 
        });
      }

      next();
    } catch (error) {
      logger.error('Permission middleware error:', error);
      res.status(500).json({ 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };
};

module.exports = {
  checkPermissions
}; 