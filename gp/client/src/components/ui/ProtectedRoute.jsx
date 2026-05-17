// client/src/components/ui/ProtectedRoute.jsx
// Wraps any route that requires authentication + optional role check.
//
// Usage:
//   <ProtectedRoute>                              // just auth check
//   <ProtectedRoute allowedRoles={['manager']}>   // auth + role check
//   <ProtectedRoute allowedRoles={['admin','manager']}>

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // ── Session still restoring from localStorage ────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Loading session...</p>
        </div>
      </div>
    );
  }

  // ── Not authenticated → redirect to login ────────────────────────────────
  // Pass current location in state so we can redirect back after login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ── Wrong role → show unauthorized page ──────────────────────────────────
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
