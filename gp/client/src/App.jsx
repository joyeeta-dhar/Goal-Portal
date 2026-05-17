// client/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import ProtectedRoute from './components/ui/ProtectedRoute';
import { ROLES } from './constants/roles';

import LoginPage from './pages/LoginPage';
import Unauthorized from './pages/Unauthorized';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import MyGoals from './pages/employee/MyGoals';
import QuarterlyUpdates from './pages/employee/QuarterlyUpdates';
import Comments from './pages/employee/Comments';
import ActivityLog from './pages/employee/ActivityLog';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import TeamGoals from './pages/manager/TeamGoals';
import Approvals from './pages/manager/Approvals';
import ManagerComments from './pages/manager/ManagerComments';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import GoalsOverview from './pages/admin/GoalsOverview';
import AuditLog from './pages/admin/AuditLog';

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/employee/dashboard" element={
            <ProtectedRoute allowedRoles={[ROLES.EMPLOYEE]}><EmployeeDashboard /></ProtectedRoute>
          } />
          <Route path="/employee/goals" element={
            <ProtectedRoute allowedRoles={[ROLES.EMPLOYEE]}><MyGoals /></ProtectedRoute>
          } />
          <Route path="/employee/quarterly" element={
            <ProtectedRoute allowedRoles={[ROLES.EMPLOYEE]}><QuarterlyUpdates /></ProtectedRoute>
          } />
          <Route path="/employee/comments" element={
            <ProtectedRoute allowedRoles={[ROLES.EMPLOYEE]}><Comments /></ProtectedRoute>
          } />
          <Route path="/employee/activity" element={
            <ProtectedRoute allowedRoles={[ROLES.EMPLOYEE]}><ActivityLog /></ProtectedRoute>
          } />

          <Route path="/manager/dashboard" element={
            <ProtectedRoute allowedRoles={[ROLES.MANAGER]}><ManagerDashboard /></ProtectedRoute>
          } />
          <Route path="/manager/team-goals" element={
            <ProtectedRoute allowedRoles={[ROLES.MANAGER]}><TeamGoals /></ProtectedRoute>
          } />
          <Route path="/manager/approvals" element={
            <ProtectedRoute allowedRoles={[ROLES.MANAGER]}><Approvals /></ProtectedRoute>
          } />
          <Route path="/manager/comments" element={
            <ProtectedRoute allowedRoles={[ROLES.MANAGER]}><ManagerComments /></ProtectedRoute>
          } />

          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}><UserManagement /></ProtectedRoute>
          } />
          <Route path="/admin/goals" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}><GoalsOverview /></ProtectedRoute>
          } />
          <Route path="/admin/audit" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}><AuditLog /></ProtectedRoute>
          } />

          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-200 mb-2">404</h1>
                <p className="text-gray-400 text-sm">Page not found</p>
              </div>
            </div>
          } />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
