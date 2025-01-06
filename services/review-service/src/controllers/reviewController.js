const Review = require('../models/Review');

// Create a new review
const createReview = async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get reviews for a specific locksmith
const getLocksmithReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ locksmithId: req.params.locksmithId });
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a specific review
const getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, error: 'Review not found' });
    }
    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all reviews
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createReview,
  getLocksmithReviews,
  getReview,
  getAllReviews
};
