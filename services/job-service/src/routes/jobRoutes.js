const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { authenticateLocksmith } = require('../middleware/auth');

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'Job Service is running' });
});

// Job creation routes
router.post('/create', jobController.createJob);  // Remove auth for now
router.post('/import', authenticateLocksmith, jobController.importExternalJobs);
router.put('/status', authenticateLocksmith, jobController.updateStatus);
router.get('/list', authenticateLocksmith, jobController.getLocksmithJobs);
router.get('/:id', authenticateLocksmith, jobController.getJob);

module.exports = router; 