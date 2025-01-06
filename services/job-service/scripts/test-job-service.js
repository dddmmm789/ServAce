const axios = require('axios');
const jwt = require('jsonwebtoken');

// Generate a test token for a locksmith
const testToken = jwt.sign(
  {
    id: '123456789012',
    role: 'locksmith',
    name: 'Test Locksmith'
  },
  process.env.JWT_SECRET || 'your-jwt-secret',
  { expiresIn: '1h' }
);

async function testJobService() {
  const baseURL = 'http://localhost:3008/api/jobs';
  const headers = {
    'Authorization': `Bearer ${testToken}`,
    'Content-Type': 'application/json'
  };

  try {
    // First test the health endpoint
    console.log('\nTesting health endpoint...');
    const healthResponse = await axios.get('http://localhost:3008/api/health');
    console.log('Health check:', healthResponse.data);

    // Create a new job
    console.log('\nCreating new job...');
    const jobData = {
      customerName: 'John Doe',
      customerPhone: '555-0123',
      service: 'lockout',
      location: {
        type: 'Point',
        coordinates: [-73.935242, 40.730610],
        address: {
          formatted: '123 Test St, New York, NY 10001'
        }
      },
      notes: 'Customer locked out of apartment',
      price: {
        amount: 15000, // $150.00
        currency: 'USD'
      }
    };
    console.log('Sending job data:', jobData);
    
    const createResponse = await axios.post(`${baseURL}/create`, jobData, { headers });
    console.log('Job created:', createResponse.data);

    const jobId = createResponse.data.job._id;

    // 2. Get job list
    console.log('\nGetting job list...');
    const listResponse = await axios.get(`${baseURL}/list`, { headers });
    console.log('Job list:', listResponse.data);

    // 3. Update job status
    console.log('\nUpdating job status...');
    const updateResponse = await axios.put(`${baseURL}/status`, {
      jobId,
      status: 'completed'
    }, { headers });
    console.log('Job updated:', updateResponse.data);

    // 4. Get specific job
    console.log('\nGetting job details...');
    const getResponse = await axios.get(`${baseURL}/${jobId}`, { headers });
    console.log('Job details:', getResponse.data);

  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
  }
}

testJobService(); 