import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, LogIn, Building2, Shield, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/auth.service';
import { getDashboardRoute } from '../../components/auth/Guards';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please fill in all fields'); return; }
    setIsLoading(true);
    try {
      const { data } = await authService.login(form);
      const { user, accessToken, refreshToken } = data.data;
      setAuth({ user, accessToken, refreshToken });
      toast.success(`Welcome back, ${user.firstName}! 👋`);
      const from = location.state?.from?.pathname || getDashboardRoute(user.role);
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: '🏠', title: 'Visitor Management', desc: 'QR passes & real-time gate tracking' },
    { icon: '🔧', title: 'Smart Complaints', desc: 'Raise, track & resolve issues' },
    { icon: '🛡️', title: 'Security & SOS', desc: '24/7 incident management' },
    { icon: '📊', title: 'Analytics', desc: 'Real-time society insights' },
  ];

  return (
    <div className="auth-container">
      {/* Left panel — indigo gradient */}
      <div className="auth-left hidden lg:flex">
        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-20 animate-float"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.4), transparent)' }} />
        <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full opacity-15 animate-float"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.3), transparent)', animationDelay: '1.5s' }} />

        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
          className="max-w-md relative z-10">
          {/* Brand */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-white/20">
              <Building2 size={22} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-xl text-white">Smart Society Hub</div>
              <div className="text-sm text-indigo-200">Smarter Living Together</div>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Your society,<br />digitized.
          </h2>
          <p className="text-indigo-200 mb-10 text-base leading-relaxed">
            One platform for residents, committee, security and maintenance to collaborate effortlessly.
          </p>

          <div className="space-y-5">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 bg-white/15">
                  {f.icon}
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">{f.title}</div>
                  <div className="text-indigo-200 text-sm">{f.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-8 mt-12 pt-8 border-t border-white/20">
            {[['5', 'User Roles'], ['15+', 'Modules'], ['Real-time', 'Updates']].map(([val, lbl]) => (
              <div key={lbl} className="text-center">
                <div className="text-2xl font-bold text-white">{val}</div>
                <div className="text-xs text-indigo-300 mt-0.5">{lbl}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right panel — login form */}
      <div className="auth-right">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="auth-card">
          {/* Header */}
          <div className="text-center mb-7">
            <div className="w-13 h-13 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ width: 52, height: 52, background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
              <Shield size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>Welcome back</h1>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Sign in to your Smart Society Hub account</p>
          </div>

          {/* Error */}
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 rounded-xl text-sm flex items-center gap-2"
              style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c' }}>
              ⚠️ {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} id="login-form">
            <div className="form-group">
              <label className="label" htmlFor="email">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                <input id="email" name="email" type="email" autoComplete="email"
                  value={form.email} onChange={handleChange}
                  className={`input pl-9 ${error ? 'input-error' : ''}`}
                  placeholder="you@example.com" required />
              </div>
            </div>

            <div className="form-group">
              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0" htmlFor="password">Password</label>
                <Link to="/forgot-password" className="text-xs font-medium" style={{ color: '#6366f1' }}>
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                <input id="password" name="password" type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password" value={form.password} onChange={handleChange}
                  className={`input pl-9 pr-10 ${error ? 'input-error' : ''}`}
                  placeholder="Your password" required />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button id="login-submit" type="submit" disabled={isLoading} className="btn btn-primary w-full btn-lg mt-1">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2"><LogIn size={17} /> Sign in</span>
              )}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-5 p-3 rounded-xl text-xs" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534' }}>
            <div className="flex items-center gap-1.5 font-semibold mb-1">
              <CheckCircle size={12} /> Quick Start (localStorage mode)
            </div>
            Register a new account — all data saves to your browser's localStorage.
          </div>

          <p className="text-center text-sm mt-5" style={{ color: 'var(--color-text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold" style={{ color: '#6366f1' }}>Register here</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
