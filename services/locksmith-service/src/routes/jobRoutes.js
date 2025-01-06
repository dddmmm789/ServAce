const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { authenticateLocksmith } = require('../middleware/auth');

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'Job Service is running' });
});

// Debug route
router.get('/test', (req, res) => {
  res.json({ message: 'Job router is working' });
});

// Job routes
router.post('/jobs', jobController.createJob);
router.get('/jobs', jobController.getJobs);
router.get('/jobs/:id', jobController.getJob);
router.put('/jobs/:id/status', jobController.updateStatus);
router.get('/locksmith/jobs', authenticateLocksmith, jobController.getLocksmithJobs);
router.post('/jobs/import', authenticateLocksmith, jobController.importExternalJobs);

// Debug: Print all registered routes
console.log('Registered routes:');
router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
  }
});

module.exports = router; 