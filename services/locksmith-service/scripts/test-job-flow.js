const axios = require('axios');
require('dotenv').config();

const API_URL = process.env.API_URL || 'http://localhost:3001';
let token;
let jobId;

async function runTests() {
  try {
    console.log('Starting Job Flow Test...\n');

    // 1. Login
    console.log('1. Logging in...');
    const loginResponse = await axios.post(`${API_URL}/api/locksmith/login`, {
      email: 'test@locksmith.com',
      password: 'password123'
    });
    token = loginResponse.data.token;
    console.log('✓ Login successful\n');

    // 2. Create Quick Job
    console.log('2. Creating quick job...');
    const createJobResponse = await axios.post(
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
    jobId = createJobResponse.data.jobId;
    console.log('✓ Job created successfully\n');

    // 3. Get Job Details
    console.log('3. Getting job details...');
    const jobDetailsResponse = await axios.get(
      `${API_URL}/api/locksmith/jobs/${jobId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log('Job Details:', jobDetailsResponse.data);
    console.log('✓ Job details retrieved successfully\n');

    // 4. Complete Job
    console.log('4. Completing job...');
    await axios.post(
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
    console.log('✓ Job completed successfully\n');

    // 5. Get Daily Summary
    console.log('5. Getting daily summary...');
    const summaryResponse = await axios.get(
      `${API_URL}/api/locksmith/daily-summary`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log('Daily Summary:', summaryResponse.data);
    console.log('✓ Daily summary retrieved successfully\n');

    console.log('All tests completed successfully! 🎉');
  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

runTests(); 