const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

/**
 * Middleware: Verify JWT token from the Authorization header.
 * Attaches the decoded user info to req.user.
 * 
 * Usage: router.get('/protected', authenticate, handler)
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, username, role }
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Middleware: Check if the authenticated user is an admin.
 * Must be used AFTER authenticate middleware.
 * 
 * Usage: router.delete('/admin-only', authenticate, authorizeAdmin, handler)
 */
function authorizeAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

module.exports = { authenticate, authorizeAdmin };
