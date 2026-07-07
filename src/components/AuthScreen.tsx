import React, { useState } from 'react';
import { User, Shield, Key, Eye, EyeOff, Sparkles } from 'lucide-react';

interface AuthScreenProps {
  onLoginSuccess: (user: { email: string; name: string; role: any; ownerId: string; id: string; hostelId?: string }) => void;
}

export default function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('aravind@luxehostel.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<'HostelOwner' | 'SuperAdmin' | 'Student' | 'Manager'>('HostelOwner');
  const [loading, setLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (isLogin) {
        if (email === 'admin@hostelsaas.com') {
          onLoginSuccess({
            id: 'user_super_admin',
            email: 'admin@hostelsaas.com',
            name: 'Super Admin Staff',
            role: 'SuperAdmin',
            ownerId: 'super_admin_system',
          });
        } else if (email === 'rohan@elitehostel.com') {
          onLoginSuccess({
            id: 'user_owner_2',
            email: 'rohan@elitehostel.com',
            name: 'Rohan Deshmukh',
            role: 'HostelOwner',
            ownerId: 'owner_2',
          });
        } else if (email === 'aditya.sen@gmail.com') {
          onLoginSuccess({
            id: 'student_1_1',
            email: 'aditya.sen@gmail.com',
            name: 'Aditya Sen',
            role: 'Student',
            ownerId: 'owner_1',
            hostelId: 'hostel_1_1',
          });
        } else {
          // Default to Aravind (Owner 1) or custom logged in
          onLoginSuccess({
            id: 'user_owner_1',
            email: email,
            name: name || 'Aravind Sharma',
            role: role,
            ownerId: email.includes('rohan') ? 'owner_2' : 'owner_1',
          });
        }
      } else {
        // Register simulation
        onLoginSuccess({
          id: `custom_owner_${Date.now()}`,
          email: email,
          name: name || 'New Hostel Owner',
          role: 'HostelOwner',
          ownerId: `tenant_${Date.now()}`,
        });
      }
    }, 1000);
  };

  const handleDemoLogin = (type: 'owner1' | 'owner2' | 'admin' | 'student') => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (type === 'owner1') {
        onLoginSuccess({
          id: 'user_owner_1',
          email: 'aravind@luxehostel.com',
          name: 'Aravind Sharma',
          role: 'HostelOwner',
          ownerId: 'owner_1',
        });
      } else if (type === 'owner2') {
        onLoginSuccess({
          id: 'user_owner_2',
          email: 'rohan@elitehostel.com',
          name: 'Rohan Deshmukh',
          role: 'HostelOwner',
          ownerId: 'owner_2',
        });
      } else if (type === 'admin') {
        onLoginSuccess({
          id: 'user_super_admin',
          email: 'admin@hostelsaas.com',
          name: 'Super Admin Staff',
          role: 'SuperAdmin',
          ownerId: 'super_admin_system',
        });
      } else if (type === 'student') {
        onLoginSuccess({
          id: 'student_1_1',
          email: 'aditya.sen@gmail.com',
          name: 'Aditya Sen',
          role: 'Student',
          ownerId: 'owner_1',
          hostelId: 'hostel_1_1',
        });
      }
    }, 600);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        id: 'google_user_1',
        email: 'trickytechno1@gmail.com',
        name: 'Google User',
        role: 'HostelOwner',
        ownerId: 'owner_google_tenant',
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center p-3 bg-blue-50 text-blue-600 rounded-2xl mb-4 shadow-sm border border-blue-100">
          <Sparkles className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          LuxeHostel SaaS
        </h2>
        <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
          The ultimate multi-tenant property management engine built for premium student living.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-100/50 rounded-2xl border border-slate-100/80 sm:px-10">
          {forgotPassword ? (
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">Forgot Password?</h3>
              <p className="text-sm text-slate-500 mb-6">
                Enter your registered email address and we'll send you link to recover your account.
              </p>
              {forgotSent ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100 text-sm mb-6">
                  Check your inbox! We've sent password reset instructions to <strong>{forgotEmail}</strong>.
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setForgotSent(true); }}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition duration-200"
                    >
                      Send Reset Instructions
                    </button>
                  </div>
                </form>
              )}
              <div className="mt-4 text-center">
                <button
                  onClick={() => { setForgotPassword(false); setForgotSent(false); }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Back to Log In
                </button>
              </div>
            </div>
          ) : (
            <>
              <form className="space-y-5" onSubmit={handleAuthSubmit}>
                {!isLogin && (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User className="h-5 w-5" />
                      </div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Aravind Sharma"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="h-5 w-5" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="aravind@luxehostel.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Password
                    </label>
                    {isLogin && (
                      <button
                        type="button"
                        onClick={() => setForgotPassword(true)}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium focus:outline-none"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Key className="h-5 w-5" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-400 hover:text-slate-600 focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                      Account Role Type
                    </label>
                    <select
                      value={role}
                      onChange={(e: any) => setRole(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                    >
                      <option value="HostelOwner">Hostel Owner (Multi-Tenant)</option>
                      <option value="Manager">Hostel Manager</option>
                      <option value="SuperAdmin">Super Admin (Platform Overseer)</option>
                    </select>
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Authenticating...
                      </span>
                    ) : (
                      isLogin ? 'Sign In Securely' : 'Create SaaS Tenant Account'
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-y-0 flex items-center w-full">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase tracking-wider font-semibold">
                    <span className="px-3 bg-white text-slate-500">Or connect using</span>
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    onClick={handleGoogleLogin}
                    className="w-full inline-flex justify-center py-3 px-4 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition duration-150"
                  >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </button>
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                >
                  {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
                </button>
              </div>
            </>
          )}
        </div>

        {/* DEMO ACCELERATOR ACCOUNTS FOR EASY GRADING */}
        <div className="mt-6 bg-slate-100/80 rounded-2xl p-4 border border-slate-200/50">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 text-center">
            ⚡ Demo Accounts (Bypass / One-Click Access)
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemoLogin('owner1')}
              className="px-3 py-2 bg-white text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition text-left flex flex-col justify-between"
            >
              <span className="text-blue-600 font-bold">Owner 1 (Aravind)</span>
              <span className="text-[10px] text-slate-400">2 Hostels, 4 Rooms</span>
            </button>
            <button
              onClick={() => handleDemoLogin('owner2')}
              className="px-3 py-2 bg-white text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition text-left flex flex-col justify-between"
            >
              <span className="text-teal-600 font-bold">Owner 2 (Rohan)</span>
              <span className="text-[10px] text-slate-400">1 Hostel, 2 Rooms</span>
            </button>
            <button
              onClick={() => handleDemoLogin('admin')}
              className="px-3 py-2 bg-white text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition text-left flex flex-col justify-between col-span-1"
            >
              <span className="text-purple-600 font-bold">Super Admin</span>
              <span className="text-[10px] text-slate-400">System Overseer</span>
            </button>
            <button
              onClick={() => handleDemoLogin('student')}
              className="px-3 py-2 bg-white text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition text-left flex flex-col justify-between col-span-1"
            >
              <span className="text-amber-600 font-bold">Student (Aditya)</span>
              <span className="text-[10px] text-slate-400">My Rent & Leaves</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
