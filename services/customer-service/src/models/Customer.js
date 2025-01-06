const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const emailValidator = require('email-validator');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    sparse: true,
    validate: {
      validator: function(v) {
        return !v || emailValidator.validate(v);
      }
    }
  },
  password: {
    type: String,
    required: function() { return this.type === 'registered'; }
  },
  phone: {
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
      street: String,
      city: String,
      state: String,
      zip: String,
      formatted: String
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      }
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  trackingId: {
    type: String,
    sparse: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['registered', 'anonymous'],
    default: 'registered'
  },
  createdBy: {
    type: {
      type: String,
      enum: ['self', 'locksmith', 'system'],
      required: true
    },
    locksmithId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Locksmith',
      required: function() { return this.createdBy.type === 'locksmith'; }
    }
  }
});

// Index for geospatial queries
customerSchema.index({ 'location.coordinates': '2dsphere' });

// Add index for phone number lookups
customerSchema.index({ phone: 1 }, { sparse: true });

// Hash password before saving
customerSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  this.updatedAt = new Date();
  next();
});

// Method to compare passwords
customerSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Customer', customerSchema); 