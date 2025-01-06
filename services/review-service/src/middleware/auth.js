const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    console.log('Auth Header:', req.headers.authorization);
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'Authentication required' });
    }

    console.log('Token:', token);
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Auth error:', error.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};

const adminMiddleware = (req, res, next) => {
  console.log('User in admin check:', req.user);
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };
