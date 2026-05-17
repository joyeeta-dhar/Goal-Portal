// server/routes/auth.routes.js
const express    = require('express');
const router     = express.Router();
const { login, getMe, logout, register } = require('../controllers/auth.controller');
const { authenticate }                   = require('../middleware/auth');

// Public routes
router.post('/login',    login);
router.post('/register', register);

// Protected routes (require valid JWT)
router.get('/me',       authenticate, getMe);
router.post('/logout',  authenticate, logout);

module.exports = router;
