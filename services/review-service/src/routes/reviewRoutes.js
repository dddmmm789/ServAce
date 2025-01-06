const express = require('express');
const reviewController = require('../controllers/reviewController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/locksmith/:locksmithId/reviews', reviewController.getLocksmithReviews);
router.get('/locksmith/:locksmithId/stats', reviewController.getReviewStats);

// Admin routes - no auth middleware for now to test functionality
router.post('/admin/locksmiths/:locksmithId/generate-reviews', reviewController.generateTestReviews);

// Customer routes
router.post('/jobs/:jobId/review', reviewController.submitReview);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'Review Service is running' });
});

// Review routes
router.post('/create', reviewController.createReview);
router.get('/list', reviewController.getReviews);
router.get('/:id', reviewController.getReview);
router.get('/', reviewController.getAllReviews);

module.exports = router;
