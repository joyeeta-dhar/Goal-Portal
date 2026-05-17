// server/controllers/auth.controller.js
// Handles all authentication: login, session restore, logout.

const jwt             = require('jsonwebtoken');
const { DEMO_USERS }  = require('../config/constants');
const { logAudit }    = require('../utils/auditLogger');
const { success, error } = require('../utils/responseHelper');

const JWT_SECRET  = process.env.JWT_SECRET || 'hackathon-secret-key-change-in-prod';
const JWT_EXPIRES = '8h';

// ─── POST /api/auth/login ──────────────────────────────────────────────────
const login = async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json(error('Email and password are required'));
  }

  // Find matching demo user (case-insensitive email)
  const user = DEMO_USERS.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === password
    // Production: use bcrypt.compare(password, u.passwordHash)
  );

  if (!user) {
    return res.status(401).json(error('Invalid email or password'));
  }

  // Build JWT payload — never store sensitive data (passwords, SSNs) in token
  const payload = {
    id:         user.id,
    email:      user.email,
    name:       user.name,
    role:       user.role,
    department: user.department,
    managerId:  user.managerId,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });

  // Record login in audit trail
  await logAudit({
    action:          'USER_LOGIN',
    performedBy:     user.id,
    performedByName: user.name,
    targetId:        user.id,
    entityType:      'user',
    newValue:        { role: user.role },
  });

  // Return token + user so the frontend can populate AuthContext immediately
  // without a second /me call
  return res.status(200).json(
    success('Login successful', { token, user: payload })
  );
};

// ─── GET /api/auth/me ──────────────────────────────────────────────────────
// Returns current user from JWT — no DB call needed for hackathon demo
const getMe = async (req, res) => {
  return res.status(200).json(success('User fetched', req.user));
};

// ─── POST /api/auth/logout ─────────────────────────────────────────────────
// JWT is stateless; actual logout is done on the frontend by clearing the token.
// This endpoint exists purely for audit logging.
const logout = async (req, res) => {
  if (req.user) {
    await logAudit({
      action:          'USER_LOGOUT',
      performedBy:     req.user.id,
      performedByName: req.user.name,
      targetId:        req.user.id,
      entityType:      'user',
    });
  }
  return res.status(200).json(success('Logged out successfully'));
};

// ─── POST /api/auth/register ────────────────────────────────────────────────
const register = async (req, res) => {
  const { name, email, password, role, department } = req.body;

  if (!name || !email || !password || !role || !department) {
    return res.status(400).json(error('All fields are required'));
  }

  // Check if email already exists
  const existing = DEMO_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (existing) {
    return res.status(400).json(error('Email address is already registered'));
  }

  // Assign a new ID based on length
  const newId = `usr_${String(DEMO_USERS.length + 1).padStart(3, '0')}`;

  // Default new employees to report to Arjun Mehta (usr_002) for functional hierarchy
  const managerId = role === 'employee' ? 'usr_002' : null;

  const newUser = {
    id:           newId,
    email:        email.trim(),
    password:     password,
    name:         name.trim(),
    role:         role.toLowerCase(), // Ensure role is lowercase
    managerId:    managerId,
    department:   department,
  };

  // Push user to memory store
  DEMO_USERS.push(newUser);

  // Return success response
  return res.status(201).json(
    success('Registration successful! You can now log in.', {
      user: {
        id:         newUser.id,
        email:      newUser.email,
        name:       newUser.name,
        role:       newUser.role,
        department: newUser.department,
      },
    })
  );
};

module.exports = { login, getMe, logout, register };
