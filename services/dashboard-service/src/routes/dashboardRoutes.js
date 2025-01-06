const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateUser } = require('../middleware/auth');

router.get('/dashboard/stats', authenticateUser, dashboardController.getStats);
router.post('/dashboard/stats/update', authenticateUser, dashboardController.updateStats);

module.exports = router; 