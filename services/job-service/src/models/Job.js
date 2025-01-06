const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  customer: {
    id: { type: String },
    name: { type: String, required: true },
    phone: String
  },
  locksmith: {
    id: { type: String },
    name: String,
    phone: String
  },
  service: {
    type: String,
    required: true,
    enum: ['lockout', 'rekey', 'installation', 'repair', 'emergency']
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed'],
    default: 'pending'
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
  price: {
    amount: Number,
    currency: { type: String, default: 'USD' }
  },
  payment: {
    status: { type: String, enum: ['pending', 'paid', 'failed'] },
    stripePaymentId: String,
    amount: Number,
    timestamp: Date
  },
  priority: {
    type: String,
    enum: ['normal', 'high', 'emergency'],
    default: 'normal'
  },
  scheduledFor: Date,
  completedAt: Date,
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  customerViews: [{
    timestamp: { type: Date, default: Date.now },
    userAgent: String,
    deviceType: String
  }],
  addressDetails: {
    floor: String,
    apartment: String,
    additionalInfo: String,
    isConfirmed: { type: Boolean, default: false },
    lastUpdated: Date
  }
});

jobSchema.index({ 'location.coordinates': '2dsphere' });
jobSchema.index({ status: 1, priority: 1 });
jobSchema.index({ 'customer.id': 1 });
jobSchema.index({ 'locksmith.id': 1 });

module.exports = mongoose.model('Job', jobSchema); 