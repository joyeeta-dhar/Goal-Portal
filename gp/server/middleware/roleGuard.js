// server/middleware/roleGuard.js
// Enforces role-based access on protected routes.
// Usage: router.get('/admin-only', authenticate, requireRole('admin'), handler)
//        router.get('/mgr-or-admin', authenticate, requireRole('manager', 'admin'), handler)

const { error } = require('../utils/responseHelper');

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(error('Not authenticated'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json(error(`Access denied. Required role: ${allowedRoles.join(' or ')}`));
    }

    next();
  };
};

module.exports = { requireRole };
