// client/src/context/AuthContext.jsx
// Global authentication state — wraps the entire app in main.jsx.
// Provides: user, token, loading, isAuthenticated, login(), logout()

import { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(null);
  // loading=true during the initial localStorage restore to prevent flash
  const [loading, setLoading] = useState(true);

  // ── Restore session on app load ──────────────────────────────────────────
  // If a valid token + user exist in localStorage, restore them to state.
  // This prevents users from being logged out on page refresh.
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser  = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        // Corrupted data — clear it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    setLoading(false);
  }, []);

  // ── Login ────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const res = await authService.login(email, password);

    if (res.success) {
      const { token: newToken, user: newUser } = res.data;
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
      return { success: true, user: newUser };
    }

    return { success: false, message: res.message };
  }, []);

  // ── Logout ───────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    await authService.logout(); // clears localStorage internally
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{ user, token, loading, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
