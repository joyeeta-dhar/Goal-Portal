// server/app.js
// Express application setup — middleware, routes, error handler.
// server.js imports this and calls app.listen().

const express    = require('express');
const cors       = require('cors');
const authRoutes = require('./routes/auth.routes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// ─── Core middleware ───────────────────────────────────────────────────────
// Enable dynamic CORS mapping for seamless frontend-backend integration across local and Vercel hosting.
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());

// ─── Health check (Render uses this to verify deployment) ─────────────────
app.get('/health', (_, res) =>
  res.json({ status: 'OK', ts: new Date().toISOString() })
);

// ─── API routes ────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
// Add more routes here as you build them:
// app.use('/api/goals',      goalRoutes);
// app.use('/api/approvals',  approvalRoutes);
// app.use('/api/tracking',   trackingRoutes);
// app.use('/api/admin',      adminRoutes);

// ─── Global error handler (MUST be last) ──────────────────────────────────
app.use(errorHandler);

module.exports = app;
