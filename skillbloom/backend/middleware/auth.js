const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT Authentication Middleware (protect routes)
const auth = async (req, res, next) => {
  // Get token from Authorization header (Bearer TOKEN)
  const authHeader = req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Access denied. No token provided.' 
    });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from MySQL database (without password)
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Remove password from user object for security
    delete user.password;
    
    // Attach user to req object
    req.user = user;
    next();
    
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = auth;

