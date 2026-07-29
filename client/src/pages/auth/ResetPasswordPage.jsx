import { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Lock, CheckCircle, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { authService } from '../../services/auth.service';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Invalid or missing reset token.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await authService.resetPassword(token, password);
      setIsSuccess(true);
      toast.success('Password reset successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Link may be expired.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ background: '#f4f6fb' }}>
        <div className="relative z-10 w-full max-w-md bg-white rounded-[24px] shadow-xl p-8 border border-slate-100 text-center">
          <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Password Reset</h2>
          <p className="text-slate-500 mb-8">Your password has been successfully updated. You can now login with your new credentials.</p>
          <Link to="/login" className="btn btn-primary w-full text-center py-3">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ background: '#f4f6fb' }}>
      {/* Decorative Orbs */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-3xl -top-48 -left-48 pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-3xl -bottom-32 -right-32 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-white rounded-[24px] shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Set New Password</h2>
          <p className="text-slate-500 text-sm">Please enter your new password below.</p>
        </div>

        {error && (
          <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-6">
            <label className="label">New Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className={`input pl-12 pr-12 ${error ? 'input-error' : ''}`}
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !token}
            className="btn btn-primary w-full py-3 mb-4"
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
          
          <div className="text-center">
            <Link to="/login" className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
              Cancel and return to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
