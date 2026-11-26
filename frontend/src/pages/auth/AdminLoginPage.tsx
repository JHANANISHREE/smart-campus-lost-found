import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Sparkles,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';
import { authService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide administrative credentials.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.loginAdmin({
        email: email.trim(),
        password,
      });

      if (res.success && res.data) {
        login(res.data.token, res.data);
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Access Denied: Invalid administrator credentials or role unauthorized.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@campus.edu');
    setPassword('Admin@123');
    setError('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-900">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 mx-auto">
            <ShieldAlert className="w-7 h-7 text-indigo-200" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Campus Administration Console
          </h2>
          <p className="text-xs text-slate-400">
            Restricted access for authorized Campus Security Officers &amp; Staff.
          </p>
        </div>

        {/* Demo Fast-fill banner */}
        <div className="bg-indigo-950/60 p-3 rounded-2xl border border-indigo-500/30 flex items-center justify-between text-xs text-indigo-200">
          <div className="flex items-center space-x-2 font-medium">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Faculty Evaluator? Auto-fill Admin login:</span>
          </div>
          <button
            type="button"
            onClick={fillDemoAdmin}
            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-[11px] transition-colors shadow"
          >
            Auto Fill
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-700/80">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-950/60 text-rose-300 rounded-xl text-xs flex items-start space-x-2 border border-rose-800/60">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Administrator Email <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="admin@campus.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900/80 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Security Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 text-xs bg-slate-900/80 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Security Notice */}
            <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60 leading-relaxed">
              🔒 Spring Security strictly validates that the authenticated account has <code className="text-indigo-400 font-mono">ROLE_ADMIN</code>. Student credentials will be rejected.
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span>Verifying Administrator Token...</span>
              ) : (
                <>
                  <span>Sign In as Administrator</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-700 text-center">
            <Link
              to="/user/login"
              className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Student Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

