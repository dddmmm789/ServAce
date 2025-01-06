const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  locksmithId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'LocksmithUser'
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Customer'
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Job'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  content: {
    type: String,
    required: false // Allow star-only reviews
  },
  reviewerName: {
    type: String,
    required: true
  },
  isVerifiedCustomer: {
    type: Boolean,
    default: true
  },
  isAdminGenerated: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  }
}, {
  timestamps: true
});

// Add index for efficient lookups
reviewSchema.index({ locksmithId: 1, createdAt: -1 });

// Static method to calculate average rating
reviewSchema.statics.calculateAverageRating = async function(locksmithId) {
  const result = await this.aggregate([
    { $match: { locksmithId: new mongoose.Types.ObjectId(locksmithId) } },
    { $group: {
      _id: null,
      averageRating: { $avg: '$rating' },
      totalReviews: { $sum: 1 }
    }}
  ]);
  return result[0] || { averageRating: 0, totalReviews: 0 };
};

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
