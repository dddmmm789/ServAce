const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  locksmith: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Locksmith',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'completed', 'cancelled'],
    default: 'pending'
  },
  service: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    },
    address: {
      formatted: String,
      street: String,
      city: String,
      state: String,
      zip: String
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

requestSchema.index({ 'location.coordinates': '2dsphere' });

module.exports = mongoose.model('Request', requestSchema); 