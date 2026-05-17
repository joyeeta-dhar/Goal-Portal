// server/utils/responseHelper.js
// Standard API response shape used by every controller.
// Keeps all responses consistent: { success, message, data }

const success = (message, data = null) => ({
  success: true,
  message,
  data,
});

const error = (message, errors = null) => ({
  success:  false,
  message,
  ...(errors && { errors }),
});

module.exports = { success, error };
