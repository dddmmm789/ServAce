const mongoose = require('mongoose');
const Admin = require('../src/models/Admin');
const Locksmith = require('../src/models/Locksmith');
require('dotenv').config();

const MONGODB_URI = 'mongodb://locksmith-db:27017/locksmith-service';

const completeTestLocksmith = {
  name: 'Michael Anderson',
  email: 'michael@andersonsecurity.com',
  password: 'password123',
  phone: '(212) 555-0123',
  verificationStatus: 'verified',
  verifiedAt: new Date('2023-12-01'),
  
  businessInfo: {
    companyName: 'Anderson Advanced Security Solutions',
    address: '350 Fifth Avenue, Suite 4200, New York, NY 10118',
    website: 'https://andersonsecurity.com',
    yearsInBusiness: 20,
    serviceArea: [
      'Manhattan',
      'Brooklyn',
      'Queens',
      'Bronx',
      'Staten Island',
      'Long Island'
    ]
  },
  
  services: {
    residential: true,
    commercial: true,
    automotive: true,
    emergency: true,
    rates: {
      hourly: 150,
      emergency: 300,
      minimumCallOut: 125
    }
  },
  
  documents: [
    {
      type: 'license',
      url: 'https://docs.andersonsecurity.com/licenses/master-license-2024.pdf',
      verified: true,
      expiryDate: new Date('2025-12-31'),
      licenseNumber: 'NYS-LMS-2024-001',
      coverage: null,
      provider: null
    },
    {
      type: 'insurance',
      url: 'https://docs.andersonsecurity.com/insurance/liability-2024.pdf',
      verified: true,
      coverage: '5M',
      provider: 'SecurityPro Insurance Group',
      expiryDate: new Date('2024-12-31')
    }
  ],
  
  availability: {
    monday: { start: '07:00', end: '23:00' },
    tuesday: { start: '07:00', end: '23:00' },
    wednesday: { start: '07:00', end: '23:00' },
    thursday: { start: '07:00', end: '23:00' },
    friday: { start: '07:00', end: '23:00' },
    saturday: { start: '08:00', end: '20:00' },
    sunday: { start: '09:00', end: '18:00' }
  },
  
  specialties: [
    'High Security Locks',
    'Biometric Access Control',
    'Safe Installation & Repair',
    'Master Key Systems',
    'Bank Vault Maintenance',
    'Electronic Security Systems',
    'Smart Home Integration',
    'Emergency Lockout Services',
    'Automotive Key Programming',
    'Security System Design'
  ],
  
  certifications: [
    'ALOA Certified Master Locksmith (CML)',
    'Certified Safe Technician (CPS)',
    'Certified Master Safe Technician (CMST)',
    'Certified Automotive Locksmith (CAL)',
    'Electronic Security Consultant (ESC)',
    'GSA Certified Safe & Vault Technician',
    'Smart Home Security Specialist',
    'Access Control System Specialist',
    'Medeco Security Center Certified'
  ],
  
  rating: {
    average: 4.95,
    count: 428
  },
  
  profile: {
    tagline: "Master Locksmith with 20+ years securing NYC's homes and businesses",
    bio: `With over two decades of experience in the security industry, I've dedicated my career to providing top-tier locksmith services across New York City. Starting as an apprentice in my father's locksmith shop, I've grown to master both traditional and cutting-edge security solutions. My team and I specialize in high-security systems, biometric access control, and emergency services, available 24/7 for Manhattan's security needs.

    As a certified Master Locksmith and security consultant, I take pride in offering customized security solutions that meet each client's unique needs. Whether it's upgrading a home security system, designing master key systems for commercial properties, or handling emergency lockouts, we deliver professional service with integrity and expertise.`,
    profileImage: "https://andersonsecurity.com/team/michael-anderson.jpg",
    languages: ["English", "Spanish", "Hebrew"],
    yearsOfExperience: 20,
    preferredWorkArea: ["Manhattan", "Downtown Brooklyn"]
  },

  reviews: [], // Start empty, will be populated by review service

  statistics: {
    totalJobs: 1247,
    completedJobs: 1239,
    responseTime: 15, // 15 minutes average response time
    completionRate: 99.4
  }
};

const testLocksmiths = [completeTestLocksmith];

async function createTestData() {
  try {
    console.log('Starting test data creation...');
    console.log('MongoDB URI:', MONGODB_URI);
    console.log('Connecting to MongoDB...');
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await Admin.deleteMany({});
    await Locksmith.deleteMany({});
    console.log('Data cleared');

    // Create admin
    console.log('Creating test admin...');
    const admin = new Admin({
      email: 'admin@locksmith.com',
      password: 'admin123',
      name: 'Test Admin',
      role: 'admin'
    });
    await admin.save();

    // Create test locksmiths
    console.log('Creating test locksmiths...');
    for (const locksmithData of testLocksmiths) {
      const locksmith = new Locksmith(locksmithData);
      await locksmith.save();
      console.log(`Created locksmith: ${locksmith.name} (${locksmith.verificationStatus})`);
      console.log(`Business: ${locksmith.businessInfo.companyName}`);
      console.log(`Services: ${Object.keys(locksmith.services).filter(key => locksmith.services[key] === true).join(', ')}`);
      console.log('---');
    }

    console.log('Test data created successfully');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error creating test data:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

createTestData(); 