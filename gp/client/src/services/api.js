// client/src/services/api.js
// Central Axios instance — ALL API calls go through here.
// Handles: base URL, auth header injection, 401 redirect.

import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request interceptor ───────────────────────────────────────────────────
// Automatically attach JWT from localStorage to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor ─────────────────────────────────────────────────
// Handle 401 globally: clear storage and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Hard redirect preserves the session-expiry UX without React Router
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
