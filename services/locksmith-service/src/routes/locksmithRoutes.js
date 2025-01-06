const express = require('express');
const router = express.Router();
const { createJob } = require('../controllers/jobController');
const { login, requestOTP, verifyOTP } = require('../controllers/authController');

// Auth routes
router.post('/login', login);
router.post('/request-otp', requestOTP);
router.post('/verify-otp', verifyOTP);

// Job routes
router.post('/jobs/create', createJob);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'locksmith-api' });
});

module.exports = router; 