const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Business Information Schema
const businessInfoSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  website: String,
  yearsInBusiness: Number,
  serviceArea: [String]
});

// Service Rates Schema
const ratesSchema = new mongoose.Schema({
  hourly: {
    type: Number,
    required: true
  },
  emergency: {
    type: Number,
    required: true
  },
  minimumCallOut: {
    type: Number,
    required: true
  }
});

// Services Schema
const servicesSchema = new mongoose.Schema({
  residential: {
    type: Boolean,
    default: false
  },
  commercial: {
    type: Boolean,
    default: false
  },
  automotive: {
    type: Boolean,
    default: false
  },
  emergency: {
    type: Boolean,
    default: false
  },
  rates: ratesSchema
});

// Document Schema
const documentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['license', 'insurance']
  },
  url: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  expiryDate: Date,
  licenseNumber: String,
  coverage: String,
  provider: String
});

// Availability Time Schema
const timeSlotSchema = new mongoose.Schema({
  start: String,
  end: String
});

// Availability Schema
const availabilitySchema = new mongoose.Schema({
  monday: timeSlotSchema,
  tuesday: timeSlotSchema,
  wednesday: timeSlotSchema,
  thursday: timeSlotSchema,
  friday: timeSlotSchema,
  saturday: timeSlotSchema,
  sunday: timeSlotSchema
});

// Rating Schema
const ratingSchema = new mongoose.Schema({
  average: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  count: {
    type: Number,
    default: 0
  }
});

// Main Locksmith Schema
const locksmithSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'suspended'],
    default: 'pending'
  },
  verifiedAt: Date,
  businessInfo: businessInfoSchema,
  services: servicesSchema,
  documents: [documentSchema],
  availability: availabilitySchema,
  specialties: [String],
  certifications: [String],
  rating: ratingSchema,
  profile: {
    tagline: {
      type: String,
      required: true,
      maxLength: 200
    },
    bio: {
      type: String,
      maxLength: 1000
    },
    profileImage: String,
    languages: [String],
    yearsOfExperience: Number,
    preferredWorkArea: [String]
  },
  reviews: {
    type: [{
      reviewId: String,
      customerId: String,
      rating: Number,
      comment: String,
      jobId: String,
      createdAt: Date,
      response: {
        text: String,
        createdAt: Date
      }
    }],
    default: []
  },
  statistics: {
    totalJobs: {
      type: Number,
      default: 0
    },
    completedJobs: {
      type: Number,
      default: 0
    },
    responseTime: {
      type: Number,  // Average response time in minutes
      default: 0
    },
    completionRate: {
      type: Number,  // Percentage
      default: 0
    }
  }
}, { timestamps: true });

// Hash password before saving
locksmithSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare password method
locksmithSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Locksmith', locksmithSchema); 