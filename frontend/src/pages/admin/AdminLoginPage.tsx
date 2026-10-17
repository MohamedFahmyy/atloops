import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Lock, Mail, ArrowRight, Eye, EyeOff, UserCheck } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('superadmin@atloops.com');
  const [password, setPassword] = useState('SuperAdmin@2026!Secured');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials or inactive account.');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { label: 'Super Admin', email: 'superadmin@atloops.com', pass: 'SuperAdmin@2026!Secured', role: 'superadmin' },
    { label: 'Administrator', email: 'admin@atloops.com', pass: 'Admin@2026!Pass', role: 'admin' },
    { label: 'Content Editor', email: 'editor@atloops.com', pass: 'Editor@2026!Pass', role: 'content_manager' },
    { label: 'Sales Rep', email: 'sales@atloops.com', pass: 'Sales@2026!Pass', role: 'sales_rep' },
    { label: 'Support Agent', email: 'support@atloops.com', pass: 'Support@2026!Pass', role: 'support_agent' },
    { label: 'Analyst', email: 'analyst@atloops.com', pass: 'Analyst@2026!Pass', role: 'analyst' },
  ];

  const handleSelectAccount = (acc: typeof demoAccounts[0]) => {
    setEmail(acc.email);
    setPassword(acc.pass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Glow Background */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/20 blur-3xl rounded-full pointer-events-none"></div>

        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>

          <h1 className="text-xl font-bold text-white tracking-tight">
            AT Loops Enterprise Admin
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Sign in to manage CMS content, leads, and page builder
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute start-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="superadmin@atloops.com"
                className="w-full ps-10 pe-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute start-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full ps-10 pe-10 py-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute end-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-6 cursor-pointer"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4 rtl-flip" />
          </button>
        </form>

        {/* Quick Demo Accounts Selection */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 mb-2.5">
            <UserCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Quick-Select Demo Role:</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {demoAccounts.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleSelectAccount(acc)}
                className={`text-[11px] text-left px-2.5 py-1.5 rounded-lg border transition-all ${
                  email === acc.email
                    ? 'bg-blue-600/20 border-blue-500/50 text-blue-300 font-semibold'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="truncate">{acc.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <Link to="/" className="hover:text-blue-400 transition-colors">
            ← Return to Website
          </Link>
          <span className="flex items-center gap-1 text-[11px] text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Sanctum Secured</span>
          </span>
        </div>

      </div>
    </div>
  );
};
