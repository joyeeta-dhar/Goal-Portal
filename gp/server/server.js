// server/server.js
// Entry point: loads env and starts the HTTP server.
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. The backend may already be running.`);
    console.error(`Open http://localhost:${PORT}/health to check it, or stop the old Node process before starting again.`);
    process.exit(1);
  }

  console.error(err);
  process.exit(1);
});
