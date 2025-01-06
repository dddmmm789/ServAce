const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const logger = require('../utils/logger');

// Log all admin route access
router.use((req, res, next) => {
  logger.info(`Admin route accessed: ${req.method} ${req.path}`);
  next();
});

// Public routes (no auth required)
router.post('/login', adminController.login);

// Protected routes (require auth)
router.use(authMiddleware);  // Apply auth middleware to all routes below
router.get('/dashboard', adminController.getDashboard);
router.get('/locksmiths', adminController.getLocksmiths);
router.get('/locksmiths/:id', adminController.getLocksmithById);
router.put('/locksmiths/:id/status', adminController.updateLocksmithStatus);
router.post('/locksmith-mode/:locksmithId', authMiddleware, adminController.enterLocksmithMode);

module.exports = router;