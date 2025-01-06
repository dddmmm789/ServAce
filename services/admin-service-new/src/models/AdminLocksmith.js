const mongoose = require('mongoose');

const adminLocksmithSchema = new mongoose.Schema({
  _id: String,
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: String,
  businessName: String,
  location: {
    address: String,
    city: String,
    state: String,
    zip: String
  },
  services: [String],
  status: {
    type: String,
    enum: ['pending', 'active', 'inactive', 'suspended'],
    default: 'pending'
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  rating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  statusUpdateReason: String,
  statusUpdatedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AdminLocksmith', adminLocksmithSchema); 