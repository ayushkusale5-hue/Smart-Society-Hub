import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Send, ArrowLeft, CheckCircle } from 'lucide-react';
import { authService } from '../../services/auth.service';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('Email is required'); return; }
    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (_) {
      // Always show success to prevent email enumeration
      setSent(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.15) 0%, transparent 60%), var(--color-bg-primary)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="auth-card w-full max-w-md text-center"
      >
        {!sent ? (
          <>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <Mail size={26} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Forgot Password?</h1>
            <p className="text-gray-500 text-sm mb-8">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl text-sm text-red-400"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} id="forgot-password-form" className="text-left">
              <div className="form-group">
                <label className="label" htmlFor="forgot-email">Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    id="forgot-email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    className="input pl-9"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <button id="send-reset-btn" type="submit" disabled={isLoading}
                className="btn btn-primary w-full btn-lg">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2"><Send size={17} /> Send Reset Link</span>
                )}
              </button>
            </form>

            <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-300 mt-6 transition-colors">
              <ArrowLeft size={15} />
              Back to Login
            </Link>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)' }}>
              <CheckCircle size={32} className="text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Check your inbox!</h2>
            <p className="text-gray-500 text-sm mb-8">
              If <strong className="text-gray-300">{email}</strong> is registered, you'll receive a password reset link shortly.
            </p>
            <Link to="/login" className="btn btn-secondary btn-lg w-full">
              Back to Login
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
