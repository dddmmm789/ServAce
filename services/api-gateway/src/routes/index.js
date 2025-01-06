const express = require('express');
const router = express.Router();

// Base routes
router.get('/', (req, res) => {
  res.json({ message: 'API Gateway is running' });
});

// Version check
router.get('/version', (req, res) => {
  res.json({ version: '1.0.0' });
});

module.exports = router; 