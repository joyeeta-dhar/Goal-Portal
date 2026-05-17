// server/middleware/auth.js
// Verifies JWT on every protected route and attaches decoded user to req.user.
// Usage: router.get('/protected', authenticate, controller)

const jwt    = require('jsonwebtoken');
const { error } = require('../utils/responseHelper');

const JWT_SECRET = process.env.JWT_SECRET || 'hackathon-secret-key-change-in-prod';

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json(error('No token provided. Please log in.'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Attach to request: { id, email, name, role, department, managerId }
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json(error('Session expired. Please log in again.'));
    }
    return res.status(401).json(error('Invalid token. Please log in.'));
  }
};

module.exports = { authenticate };
