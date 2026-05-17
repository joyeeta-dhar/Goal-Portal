// server/middleware/errorHandler.js
// Global Express error handler — must be the LAST middleware in app.js.
// Catches anything thrown or passed to next(err) in controllers.

const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${new Date().toISOString()} — ${err.message}`);

  const statusCode = err.statusCode || 500;
  const message    = err.message    || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    // Stack trace visible only in development — never expose in production
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { errorHandler };
