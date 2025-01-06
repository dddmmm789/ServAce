const mongoose = require('mongoose');
const Locksmith = require('../models/Locksmith');
require('dotenv').config();

const seedLocksmith = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete existing locksmith with this phone number
    await Locksmith.deleteOne({ phone: "(650) 847-7370" });

    // Create new locksmith
    const locksmith = new Locksmith({
      name: "Assaf Shalvi",
      email: "assaf.shalvi@locksmith-pro.com",
      phone: "(650) 847-7370",
      password: "123456", // This will be hashed by the pre-save hook
      verificationStatus: "verified",
      businessInfo: {
        companyName: "Shalvi Security Solutions",
        address: "28 Mallard Court, Bergenfield, NJ 07631",
        yearsInBusiness: 10,
        serviceArea: [
          "Bergenfield", 
          "Teaneck", 
          "Englewood", 
          "Fort Lee", 
          "Manhattan",
          "Upper West Side",
          "Upper East Side",
          "Washington Heights",
          "George Washington Bridge area"
        ]
      },
      services: {
        residential: true,
        commercial: true,
        automotive: true,
        emergency: true,
        rates: {
          hourly: 95,
          emergency: 150,
          minimumCallOut: 75
        }
      },
      documents: [{
        type: "license",
        url: "https://example.com/licenses/nj-789123.pdf",
        verified: true,
        licenseNumber: "NJ-2024-BER-789123"
      }],
      availability: {
        monday: { start: "07:00", end: "19:00" },
        tuesday: { start: "07:00", end: "19:00" },
        wednesday: { start: "07:00", end: "19:00" },
        thursday: { start: "07:00", end: "19:00" },
        friday: { start: "07:00", end: "15:00" },
        saturday: { start: "closed", end: "closed" },
        sunday: { start: "09:00", end: "17:00" }
      },
      profile: {
        tagline: "Professional Locksmith Services in NJ & NY",
        bio: "Over 10 years of experience in residential and commercial locksmith services.",
        languages: ["English", "Hebrew"],
        yearsOfExperience: 10,
        preferredWorkArea: ["Bergen County", "Manhattan"]
      }
    });

    await locksmith.save();
    console.log('Locksmith seeded successfully');

  } catch (error) {
    console.error('Error seeding locksmith:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedLocksmith(); 