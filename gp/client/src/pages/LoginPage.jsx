// client/src/pages/LoginPage.jsx
// Corporate HRMS login page — premium, modern, professional.

import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ui/Toast';
import { ROLE_HOME } from '../constants/roles';
import { authService } from '../services/authService';

// Demo credentials shown on screen for hackathon judges
const DEMO_ACCOUNTS = [
  {
    role: 'Employee',
    email: 'employee@test.com',
    password: 'test123',
    name: 'Priya Sharma',
    dept: 'Engineering',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    role: 'Manager',
    email: 'manager@test.com',
    password: 'test123',
    name: 'Arjun Mehta',
    dept: 'Engineering',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    role: 'Admin',
    email: 'admin@test.com',
    password: 'test123',
    name: 'Sunita Rao',
    dept: 'HR Governance',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

const LoginPage = () => {
  const { login, isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const navigate  = useNavigate();
  const location  = useLocation();

  // Authentication & toggle states
  const [isSignUp, setIsSignUp] = useState(false);
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  // Sign up fields state
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpDept, setSignUpDept] = useState('Engineering');
  const [signUpRole, setSignUpRole] = useState('employee');
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  // Active demo account index for visual highlighting
  const [selectedDemoIndex, setSelectedDemoIndex] = useState(null);

  // If already logged in, redirect to their dashboard
  if (isAuthenticated && user) {
    return <Navigate to={ROLE_HOME[user.role] || '/'} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email.trim(), password);
      if (res.success) {
        showToast(`Welcome back, ${res.user.name}!`, 'success');
        const from = location.state?.from?.pathname || ROLE_HOME[res.user.role];
        navigate(from, { replace: true });
      } else {
        setError(res.message || 'Login failed. Please try again.');
        showToast('Login failed. Please check credentials.', 'error');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Server error. Please try again.'
      );
      showToast('Server connection error.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!signUpName || !signUpEmail || !signUpPassword) {
      showToast('Please fill in all required fields.', 'warning');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await authService.register(
        signUpName,
        signUpEmail.trim(),
        signUpPassword,
        signUpRole,
        signUpDept
      );
      if (res.success) {
        setSignUpSuccess(true);
        showToast('Registration successful! You can now log in.', 'success');
      } else {
        showToast(res.message || 'Registration failed.', 'error');
      }
    } catch (err) {
      showToast(
        err.response?.data?.message || 'Failed to register account. Server error.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  // One-click fill for demo accounts
  const fillDemo = (account, index) => {
    setEmail(account.email);
    setPassword(account.password);
    setSelectedDemoIndex(index);
    setError('');
    showToast(`Autofilled credentials for ${account.name} (${account.role})`, 'info');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans antialiased overflow-x-hidden">
      {/* ── Left Branding Panel ─────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0C1E35] relative flex-col justify-between p-16 text-white overflow-hidden shadow-2xl">
        {/* Glow ambient meshes */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#185FA5]/30 blur-[100px] pointer-events-none" />

        {/* Brand Identity */}
        <div className="relative z-10">
          <div className="flex items-center gap-3.5 mb-20 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-100 to-blue-200 bg-clip-text text-transparent">
              PerformanceIQ
            </span>
          </div>

          <div className="space-y-6 animate-in fade-in slide-in-from-left-6 duration-700 delay-150">
            <h1 className="text-5xl font-extrabold leading-[1.15] tracking-tight bg-gradient-to-br from-white to-gray-300 bg-clip-text text-transparent">
              Align your goals.<br />Unleash performance.
            </h1>
            <p className="text-gray-300/90 text-lg leading-relaxed max-w-md">
              Set transparent goals, collect actionable feedback, and drive outstanding performance across your enterprise.
            </p>
          </div>
        </div>

        {/* Stats Strip - Glassmorphism Card */}
        <div className="relative z-10 grid grid-cols-3 gap-6 bg-white/[0.04] backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-xl shadow-black/10 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
          {[
            { value: '3 Roles',      label: 'Employee · Manager · Admin', icon: '👤' },
            { value: '4 Quarters',   label: 'Full tracking cycle',        icon: '📅' },
            { value: '100% Align',   label: 'Dynamic weightages',         icon: '🎯' },
          ].map((s) => (
            <div key={s.value} className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-base">{s.icon}</span>
                <span className="text-[15px] font-bold text-white">{s.value}</span>
              </div>
              <div className="text-gray-400 text-xs tracking-wide leading-snug">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Login & Signup Panel ─────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 lg:px-16 bg-[#F8FAFC]">
        <div className="w-full max-w-lg bg-white p-10 rounded-3xl border border-gray-100 shadow-2xl shadow-gray-200/50 relative overflow-hidden transition-all duration-300">
          
          {/* Tabs header */}
          <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-8 items-center relative z-10">
            <button
              onClick={() => { setIsSignUp(false); setError(''); }}
              className={`flex-1 text-center py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                !isSignUp ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsSignUp(true); setError(''); }}
              className={`flex-1 text-center py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                isSignUp ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Register Account
            </button>
          </div>

          {!isSignUp ? (
            /* ── SIGN IN FORM ── */
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                <p className="text-sm text-gray-400 mt-1">Select a demo account or sign in with your work email</p>
              </div>

              {/* Interactive Demo Role Cards */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  One-click demo sign-in
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {DEMO_ACCOUNTS.map((a, idx) => {
                    const isSelected = selectedDemoIndex === idx;
                    return (
                      <button
                        key={a.role}
                        type="button"
                        onClick={() => fillDemo(a, idx)}
                        className={`flex flex-col items-center justify-between p-3.5 rounded-xl border text-center transition-all duration-200 group relative ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20'
                            : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 transition-colors ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600'
                        }`}>
                          {a.icon}
                        </div>
                        <span className={`text-[12px] font-bold ${isSelected ? 'text-blue-800' : 'text-gray-700'}`}>
                          {a.role}
                        </span>
                        <span className="text-[10px] text-gray-400 truncate max-w-full block mt-0.5">
                          {a.name.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Error banner */}
              {error && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-[13px] rounded-xl px-4 py-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  <svg className="w-4 h-4 mt-0.5 shrink-0 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Work Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setSelectedDemoIndex(null); }}
                      placeholder="you@company.com"
                      required
                      className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition duration-200 placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Secret Password
                    </label>
                    <span className="text-[11px] text-gray-400">Demo code: test123</span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setSelectedDemoIndex(null); }}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition duration-200 placeholder-gray-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-400 disabled:to-indigo-400 text-white font-bold text-sm py-3 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 flex items-center justify-center gap-2 mt-4 hover:-translate-y-0.5 active:translate-y-0"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Authenticating session...
                    </>
                  ) : (
                    'Enter Dashboard'
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* ── REGISTER / SIGN UP FORM ── */
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
                <p className="text-sm text-gray-400 mt-1">Enroll your organization profile into the HR portal</p>
              </div>

              {signUpSuccess ? (
                /* Sign up visual success block */
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center space-y-4 animate-in zoom-in-95 duration-300">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-900 text-[15px]">Corporate Account Activated!</h3>
                    <p className="text-xs text-blue-700 mt-2 leading-relaxed max-w-sm mx-auto">
                      Your enterprise credentials have been initialized in-memory! Click **"Back to Login"** below, switch to the **"Sign In"** tab, and enter your email and password to log in.
                    </p>
                  </div>
                  <button
                    onClick={() => { setIsSignUp(false); setSignUpSuccess(false); }}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors duration-150"
                  >
                    Back to Login
                  </button>
                </div>
              ) : (
                /* Registration inputs */
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition duration-200 placeholder-gray-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Corporate Work Email
                    </label>
                    <input
                      type="email"
                      required
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      placeholder="jane.doe@company.com"
                      className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition duration-200 placeholder-gray-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Strong Password
                    </label>
                    <input
                      type="password"
                      required
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition duration-200 placeholder-gray-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Department
                      </label>
                      <select
                        value={signUpDept}
                        onChange={(e) => setSignUpDept(e.target.value)}
                        className="w-full px-3 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition duration-200"
                      >
                        <option>Engineering</option>
                        <option>Product Management</option>
                        <option>HR & Governance</option>
                        <option>Sales & Marketing</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Assigned Role
                      </label>
                      <select
                        value={signUpRole}
                        onChange={(e) => setSignUpRole(e.target.value)}
                        className="w-full px-3 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition duration-200"
                      >
                        <option value="employee">Employee</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm py-3 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 flex items-center justify-center gap-2 mt-4 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Request Registration
                  </button>
                </form>
              )}
            </div>
          )}

          <p className="text-xs text-gray-400 text-center mt-8 pt-4 border-t border-gray-50">
            PerformanceIQ · Enterprise Goal Management · v1.2
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
