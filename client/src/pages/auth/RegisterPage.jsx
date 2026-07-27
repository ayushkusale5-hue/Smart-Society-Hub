import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Phone, Home, Building2, UserPlus } from 'lucide-react';
import { authService } from '../../services/auth.service';
import toast from 'react-hot-toast';

const ROLES = [
  { value: 'resident',    label: '🏠 Resident',      desc: 'Society member / flat owner' },
  { value: 'security',   label: '🛡️ Security Guard', desc: 'Gate & visitor management' },
  { value: 'maintenance', label: '🔧 Maintenance',   desc: 'Complaint resolution tasks' },
  { value: 'vendor',     label: '🏪 Vendor',         desc: 'External service provider' },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    password: '', confirmPassword: '',
    role: 'resident', flatNumber: '', tower: '', societyId: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((err) => ({ ...err, [e.target.name]: '' }));
  };

  const validateStep1 = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.lastName.trim())  e.lastName  = 'Last name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (!form.password || form.password.length < 8) e.password = 'Minimum 8 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setIsLoading(true);
    try {
      await authService.register({
        email: form.email, password: form.password,
        firstName: form.firstName, lastName: form.lastName,
        phone: form.phone, role: form.role,
        flatNumber: form.flatNumber, tower: form.tower,
        societyId: form.societyId || 'default',
      });
      toast.success('Account created! Please sign in. 🎉');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      toast.error(msg);
      if (msg.includes('email')) setStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls = (field) => `input ${errors[field] ? 'input-error' : ''}`;

  return (
    <div className="auth-container">
      {/* Left panel */}
      <div className="auth-left hidden lg:flex">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-15 animate-float"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.4), transparent)' }} />
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
          className="max-w-md relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
              <Building2 size={22} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-xl text-white">Smart Society Hub</div>
              <div className="text-sm text-indigo-200">Smarter Living Together</div>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Join your smart<br />community</h2>
          <p className="text-indigo-200 mb-10">Create your account and connect with your society members digitally.</p>
          <div className="space-y-5">
            {ROLES.map((role) => (
              <div key={role.value} className="flex items-center gap-4">
                <div className="text-2xl">{role.label.split(' ')[0]}</div>
                <div>
                  <div className="font-semibold text-white text-sm">{role.label.slice(3)}</div>
                  <div className="text-indigo-200 text-sm">{role.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right panel */}
      <div className="auth-right">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="auth-card">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
              <UserPlus size={22} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>Create Account</h1>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Step {step} of 2 — {step === 1 ? 'Personal Info' : 'Society Details'}
            </p>
          </div>

          {/* Progress bar */}
          <div className="flex gap-2 mb-6">
            {[1, 2].map((s) => (
              <div key={s} className="h-1.5 rounded-full flex-1 transition-all duration-300"
                style={{ background: s <= step ? 'linear-gradient(90deg, #6366f1, #4f46e5)' : '#e2e8f0' }} />
            ))}
          </div>

          <form onSubmit={handleSubmit} id="register-form">
            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="label" htmlFor="firstName">First Name</label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                      <input id="firstName" name="firstName" value={form.firstName} onChange={handleChange}
                        className={`${inputCls('firstName')} pl-9`} placeholder="First" />
                    </div>
                    {errors.firstName && <p className="error-msg">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="label" htmlFor="lastName">Last Name</label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                      <input id="lastName" name="lastName" value={form.lastName} onChange={handleChange}
                        className={`${inputCls('lastName')} pl-9`} placeholder="Last" />
                    </div>
                    {errors.lastName && <p className="error-msg">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="label" htmlFor="reg-email">Email</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                    <input id="reg-email" name="email" type="email" value={form.email} onChange={handleChange}
                      className={`${inputCls('email')} pl-9`} placeholder="you@example.com" />
                  </div>
                  {errors.email && <p className="error-msg">{errors.email}</p>}
                </div>

                <div className="form-group">
                  <label className="label" htmlFor="phone">Phone Number</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                    <input id="phone" name="phone" value={form.phone} onChange={handleChange}
                      className={`${inputCls('phone')} pl-9`} placeholder="+91 98765 43210" />
                  </div>
                  {errors.phone && <p className="error-msg">{errors.phone}</p>}
                </div>

                <div className="form-group">
                  <label className="label" htmlFor="reg-password">Password</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                    <input id="reg-password" name="password" type={showPassword ? 'text' : 'password'}
                      value={form.password} onChange={handleChange}
                      className={`${inputCls('password')} pl-9 pr-10`} placeholder="Min. 8 characters" />
                    <button type="button" onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }}>
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {errors.password && <p className="error-msg">{errors.password}</p>}
                </div>

                <div className="form-group">
                  <label className="label" htmlFor="confirmPassword">Confirm Password</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                    <input id="confirmPassword" name="confirmPassword" type="password"
                      value={form.confirmPassword} onChange={handleChange}
                      className={`${inputCls('confirmPassword')} pl-9`} placeholder="Repeat password" />
                  </div>
                  {errors.confirmPassword && <p className="error-msg">{errors.confirmPassword}</p>}
                </div>

                <button type="button" id="next-step-btn" onClick={() => validateStep1() && setStep(2)}
                  className="btn btn-primary w-full btn-lg">Continue →</button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="form-group">
                  <label className="label">Your Role</label>
                  <div className="grid grid-cols-2 gap-2">
                    {ROLES.map((role) => (
                      <label key={role.value}
                        className={`flex items-start gap-2 p-3 rounded-xl cursor-pointer transition-all border ${
                          form.role === role.value
                            ? 'border-indigo-400 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}>
                        <input type="radio" name="role" value={role.value}
                          checked={form.role === role.value} onChange={handleChange} className="hidden" />
                        <span className="text-lg mt-0.5">{role.label.split(' ')[0]}</span>
                        <div>
                          <div className="text-xs font-semibold" style={{ color: 'var(--color-text-primary)' }}>{role.label.slice(3)}</div>
                          <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{role.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {(form.role === 'resident' || form.role === 'security' || form.role === 'maintenance') && (
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="label" htmlFor="flatNumber">Flat Number</label>
                      <div className="relative">
                        <Home size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                        <input id="flatNumber" name="flatNumber" value={form.flatNumber} onChange={handleChange}
                          className="input pl-9" placeholder="A-101" />
                      </div>
                    </div>
                    <div>
                      <label className="label" htmlFor="tower">Tower / Block</label>
                      <div className="relative">
                        <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                        <input id="tower" name="tower" value={form.tower} onChange={handleChange}
                          className="input pl-9" placeholder="Tower A" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label className="label" htmlFor="societyId">Society ID (Optional)</label>
                  <input id="societyId" name="societyId" value={form.societyId} onChange={handleChange}
                    className="input" placeholder="Leave blank for default society" />
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="btn btn-ghost btn-lg flex-1">← Back</button>
                  <button type="submit" id="register-submit" disabled={isLoading} className="btn btn-primary btn-lg flex-1">
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Creating...
                      </span>
                    ) : 'Create Account'}
                  </button>
                </div>
              </motion.div>
            )}
          </form>

          <p className="text-center text-sm mt-5" style={{ color: 'var(--color-text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold" style={{ color: '#6366f1' }}>Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
