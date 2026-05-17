// client/src/services/authService.js
// Auth API calls — thin wrapper around the api instance.
// Components should use useAuth() hook, not call this directly.

import api from './api';

export const authService = {
  /**
   * POST /api/auth/login
   * Returns { success, message, data: { token, user } }
   */
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },

  /**
   * POST /api/auth/logout
   * Clears localStorage regardless of API response.
   */
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      // Always clear — even if the API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  /**
   * GET /api/auth/me
   * Returns { success, data: user } — used to rehydrate session on page reload.
   */
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },

  /**
   * POST /api/auth/register
   * Returns { success, message, data: { user } }
   */
  register: async (name, email, password, role, department) => {
    const res = await api.post('/auth/register', { name, email, password, role, department });
    return res.data;
  },
};
