const jwt = require('jsonwebtoken');

// Authentication middleware to validate JWT token
const adminAuthMiddleware = (req, res, next) => {
  // Retrieve token from 'Authorization' header (Bearer scheme) or 'x-auth-token' header
  const token = req.header('Authorization')?.split(' ')[1] || req.header('x-auth-token');

  // Check if token exists
  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    // Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // Add admin data to the request object
    next(); // Proceed to the next middleware/controller
  } catch (err) {
    // Invalid token
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Role-based authorization middleware
const roleMiddleware = (roles) => (req, res, next) => {
  // Ensure admin's role exists and is allowed for this route
  if (!roles.includes(req.admin.role)) {
    return res.status(403).json({ error: 'Access denied: insufficient permissions only superadmin can access' });
  }

  // Proceed if role is allowed
  next();
};

module.exports = {
  adminAuthMiddleware,
  roleMiddleware,
};
