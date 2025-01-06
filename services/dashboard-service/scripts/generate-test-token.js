const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = 'your-jwt-secret';

const testPayload = {
    id: '123456789012',
    role: 'admin',
    name: 'Test Admin'
};

const token = jwt.sign(testPayload, JWT_SECRET, { expiresIn: '1d' });
console.log('Test Admin JWT Token:', token); 