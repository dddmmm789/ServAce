const jwt = require('jsonwebtoken');

const authenticateLocksmith = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.role || decoded.role !== 'locksmith') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    req.locksmith = decoded;
    next();
  } catch (error) {
    console.error('Locksmith auth error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = {
  authenticateLocksmith
}; 