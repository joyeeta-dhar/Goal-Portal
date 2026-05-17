// client/src/hooks/useAuth.js
// Convenience hook — consume AuthContext anywhere in the tree.
// Throws a clear error if used outside <AuthProvider>.

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth() must be used inside <AuthProvider>');
  }
  return ctx;
};
