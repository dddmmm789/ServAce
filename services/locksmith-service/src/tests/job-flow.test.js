const axios = require('axios');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Job = require('../models/Job');
const Locksmith = require('../models/Locksmith');

let mongoServer;
let token;
let locksmithId;
let jobId;

const API_URL = process.env.API_URL || 'http://localhost:3001';

describe('Job Flow Tests', () => {
  beforeAll(async () => {
    // Setup test database
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    // Create test locksmith
    const locksmith = new Locksmith({
      name: 'Test Locksmith',
      email: 'test@locksmith.com',
      password: 'password123',
      phone: '1234567890',
      status: 'active'
    });
    await locksmith.save();
    locksmithId = locksmith._id;

    // Login to get token
    const loginResponse = await axios.post(`${API_URL}/api/locksmith/login`, {
      email: 'test@locksmith.com',
      password: 'password123'
    });
    token = loginResponse.data.token;
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  test('Create Quick Job', async () => {
    const response = await axios.post(
      `${API_URL}/api/locksmith/jobs/quick`,
      {
        searchType: 'phone',
        searchValue: '9876543210',
        type: 'Emergency Service',
        urgency: 'urgent'
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    expect(response.status).toBe(201);
    expect(response.data.jobId).toBeDefined();
    jobId = response.data.jobId;
  });

  test('Get Job Details', async () => {
    const response = await axios.get(
      `${API_URL}/api/locksmith/jobs/${jobId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    expect(response.status).toBe(200);
    expect(response.data.status).toBe('active');
    expect(response.data.type).toBe('Emergency Service');
  });

  test('Complete Job', async () => {
    const response = await axios.post(
      `${API_URL}/api/locksmith/jobs/${jobId}/complete`,
      {
        totalAmount: 150,
        platformFee: 30,
        expenses: 10,
        netIncome: 110
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    expect(response.status).toBe(200);
    expect(response.data.message).toBe('Job completed successfully');
  });

  test('Get Daily Summary', async () => {
    const response = await axios.get(
      `${API_URL}/api/locksmith/daily-summary`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    expect(response.status).toBe(200);
    expect(response.data.jobs).toHaveLength(1);
    expect(response.data.totals.revenue).toBe(150);
    expect(response.data.totals.platformFees).toBe(30);
    expect(response.data.totals.netIncome).toBe(110);
  });
}); 