const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        
        if (!authHeader) {
            return res.status(401).json({ message: 'No authorization token provided' });
        }

        const token = authHeader.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No token found in Authorization header' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({ message: 'Invalid authentication token' });
    }
};

module.exports = auth;