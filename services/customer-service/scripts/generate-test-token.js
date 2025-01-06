const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongoose').Types;
require('dotenv').config();

const JWT_SECRET = 'your-jwt-secret';

const testPayload = {
    id: new ObjectId().toString(),
    role: 'customer',
    name: 'Test Customer'
};

const token = jwt.sign(testPayload, JWT_SECRET, { expiresIn: '1d' });
console.log('Test Customer JWT Token:', token);