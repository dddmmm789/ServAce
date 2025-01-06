const jwt = require('jsonwebtoken');
require('dotenv').config();

// Make sure we're using the correct secret
const JWT_SECRET = 'your-jwt-secret'; // Use the same value as in .env and docker-compose.yml

const testPayload = {
    id: 'test-locksmith-123',
    role: 'locksmith',
    name: 'Test Locksmith'
};

const token = jwt.sign(testPayload, JWT_SECRET, { expiresIn: '1d' });
console.log('Test JWT Token:', token); 