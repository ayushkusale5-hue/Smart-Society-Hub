import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Eye, EyeOff, Mail, Lock, User, Phone, Home, Building2,
  UserPlus, Shield, Wrench, Store, CheckCircle, ArrowRight
} from 'lucide-react';
import { authService } from '../../services/auth.service';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../../store/authStore';

const ROLES = [
  { value: 'resident',    icon: Home,    label: 'Resident',      desc: 'Society member / flat owner',   color: '#6366f1', bg: '#eef2ff' },
  { value: 'security',   icon: Shield,  label: 'Security Guard', desc: 'Gate & visitor management',     color: '#2563eb', bg: '#eff6ff' },
  { value: 'maintenance', icon: Wrench, label: 'Maintenance',    desc: 'Complaint resolution tasks',    color: '#d97706', bg: '#fffbeb' },
  { value: 'vendor',     icon: Store,   label: 'Vendor',         desc: 'External service provider',     color: '#059669', bg: '#f0fdf4' },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
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
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      toast.error(msg);
      if (msg.includes('email')) setStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const response = await authService.register(form);
      const { user, accessToken, refreshToken } = response.data;
      setAuth({ user, accessToken, refreshToken });
      toast.success(`Welcome to Smart Society Hub, ${user.firstName}!`);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || "Google Registration failed.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls = (field) => `input ${errors[field] ? 'input-error' : ''}`;
  const currentRole = ROLES.find(r => r.value === form.role);

  return (
    <div className="auth-container">
      {/* ── Left Panel ────────────────────────────────────────────────── */}
      <div className="auth-left hidden lg:flex">
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', top: -150, right: -150, background: 'radial-gradient(circle, rgba(255,255,255,0.07), transparent 70%)', pointerEvents: 'none' }} />

        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65 }}
          style={{ maxWidth: 480, position: 'relative', zIndex: 1 }}>

          <div className="flex items-center gap-3" style={{ marginBottom: 60 }}>
            <div className="flex items-center justify-center" style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}>
              <Building2 size={24} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-white" style={{ fontSize: 18 }}>Smart Society Hub</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Smarter Living Together</div>
            </div>
          </div>

          <h2 className="font-black text-white" style={{ fontSize: 48, lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: 18 }}>
            Join your smart<br />community
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: 52, fontSize: 17, lineHeight: 1.7 }}>
            Create your account and connect with your society members digitally.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {ROLES.map((role) => (
              <div key={role.value} className="flex items-center gap-4"
                style={{ padding: '18px 20px', borderRadius: 16, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)' }}>
                <div className="flex items-center justify-center flex-shrink-0"
                  style={{ width: 44, height: 44, borderRadius: 13, background: 'rgba(255,255,255,0.15)' }}>
                  <role.icon size={20} className="text-white" />
                </div>
                <div>
                  <div className="font-semibold text-white" style={{ fontSize: 15 }}>{role.label}</div>
                  <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13.5, marginTop: 2 }}>{role.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Right Panel ───────────────────────────────────────────────── */}
      <div className="auth-right">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="auth-card">

          <div className="text-center" style={{ marginBottom: 36 }}>
            <div className="inline-flex items-center justify-center mb-5"
              style={{ width: 60, height: 60, borderRadius: 20, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 8px 24px rgba(99,102,241,0.35)' }}>
              <UserPlus size={26} className="text-white" />
            </div>
            <h1 className="font-black text-slate-900" style={{ fontSize: 30, letterSpacing: '-0.025em', marginBottom: 8 }}>Create Account</h1>
            <p style={{ color: '#6b7280', fontSize: 15 }}>
              Step {step} of 2 — {step === 1 ? 'Personal Info' : 'Society Details'}
            </p>
          </div>

          {/* Progress bar */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
            {[1, 2].map((s) => (
              <div key={s} style={{ flex: 1, height: 5, borderRadius: 99, transition: 'all 0.3s ease',
                background: s <= step ? 'linear-gradient(90deg, #6366f1, #4f46e5)' : '#e8ecf4' }} />
            ))}
          </div>

          <form onSubmit={handleSubmit} id="register-form">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 22 }}>
                  <div>
                    <label className="label" htmlFor="firstName">First Name</label>
                    <div style={{ position: 'relative' }}>
                      <User size={15} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                      <input id="firstName" name="firstName" value={form.firstName} onChange={handleChange}
                        className={inputCls('firstName')} style={{ paddingLeft: 44 }} placeholder="First" />
                    </div>
                    {errors.firstName && <p className="error-msg">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="label" htmlFor="lastName">Last Name</label>
                    <div style={{ position: 'relative' }}>
                      <User size={15} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                      <input id="lastName" name="lastName" value={form.lastName} onChange={handleChange}
                        className={inputCls('lastName')} style={{ paddingLeft: 44 }} placeholder="Last" />
                    </div>
                    {errors.lastName && <p className="error-msg">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="label" htmlFor="reg-email">Email</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={15} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                    <input id="reg-email" name="email" type="email" value={form.email} onChange={handleChange}
                      className={inputCls('email')} style={{ paddingLeft: 44 }} placeholder="you@example.com" />
                  </div>
                  {errors.email && <p className="error-msg">{errors.email}</p>}
                </div>

                <div className="form-group">
                  <label className="label" htmlFor="phone">Phone Number</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={15} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                    <input id="phone" name="phone" value={form.phone} onChange={handleChange}
                      className={inputCls('phone')} style={{ paddingLeft: 44 }} placeholder="+91 98765 43210" />
                  </div>
                  {errors.phone && <p className="error-msg">{errors.phone}</p>}
                </div>

                <div className="form-group">
                  <label className="label" htmlFor="reg-password">Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={15} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                    <input id="reg-password" name="password" type={showPassword ? 'text' : 'password'}
                      value={form.password} onChange={handleChange}
                      className={inputCls('password')} style={{ paddingLeft: 44, paddingRight: 48 }} placeholder="Min. 8 characters" />
                    <button type="button" onClick={() => setShowPassword(v => !v)}
                      style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p className="error-msg">{errors.password}</p>}
                </div>

                <div className="form-group">
                  <label className="label" htmlFor="confirmPassword">Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={15} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                    <input id="confirmPassword" name="confirmPassword" type="password"
                      value={form.confirmPassword} onChange={handleChange}
                      className={inputCls('confirmPassword')} style={{ paddingLeft: 44 }} placeholder="Repeat password" />
                  </div>
                  {errors.confirmPassword && <p className="error-msg">{errors.confirmPassword}</p>}
                </div>

                <button type="button" id="next-step-btn" onClick={() => validateStep1() && setStep(2)}
                  className="btn btn-primary w-full btn-lg" style={{ width: '100%', fontSize: 15.5 }}>
                  Continue <ArrowRight size={18} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                <div className="form-group">
                  <label className="label">Your Role</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {ROLES.map((role) => {
                      const isSelected = form.role === role.value;
                      return (
                        <label key={role.value}
                          style={{
                            display: 'flex', alignItems: 'flex-start', gap: 12, padding: '16px',
                            borderRadius: 16, cursor: 'pointer', transition: 'all 0.2s ease',
                            border: `2px solid ${isSelected ? role.color + '60' : '#e8ecf4'}`,
                            background: isSelected ? role.bg : '#fafbff',
                            boxShadow: isSelected ? `0 4px 16px ${role.color}18` : 'none'
                          }}>
                          <input type="radio" name="role" value={role.value}
                            checked={isSelected} onChange={handleChange} style={{ display: 'none' }} />
                          <div className="flex items-center justify-center flex-shrink-0"
                            style={{ width: 38, height: 38, borderRadius: 11, background: isSelected ? `${role.color}18` : '#f1f5f9', marginTop: 2 }}>
                            <role.icon size={17} style={{ color: isSelected ? role.color : '#94a3b8' }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13.5, fontWeight: 700, color: isSelected ? '#0f172a' : '#374151' }}>{role.label}</div>
                            <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 3, lineHeight: 1.4 }}>{role.desc}</div>
                          </div>
                          {isSelected && <CheckCircle size={16} style={{ color: role.color, flexShrink: 0, marginTop: 2 }} />}
                        </label>
                      );
                    })}
                  </div>
                </div>

                {(form.role === 'resident' || form.role === 'security' || form.role === 'maintenance') && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 22 }}>
                    <div>
                      <label className="label" htmlFor="flatNumber">Flat Number</label>
                      <div style={{ position: 'relative' }}>
                        <Home size={15} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <input id="flatNumber" name="flatNumber" value={form.flatNumber} onChange={handleChange}
                          className="input" style={{ paddingLeft: 44 }} placeholder="A-101" />
                      </div>
                    </div>
                    <div>
                      <label className="label" htmlFor="tower">Tower / Block</label>
                      <div style={{ position: 'relative' }}>
                        <Building2 size={15} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <input id="tower" name="tower" value={form.tower} onChange={handleChange}
                          className="input" style={{ paddingLeft: 44 }} placeholder="Tower A" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label className="label" htmlFor="societyId">Society ID <span style={{ color: '#9ca3af', fontWeight: 400 }}>(Optional)</span></label>
                  <input id="societyId" name="societyId" value={form.societyId} onChange={handleChange}
                    className="input" placeholder="Leave blank for default society" />
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="button" onClick={() => setStep(1)} className="btn btn-ghost btn-lg" style={{ flex: 1 }}>← Back</button>
                  <button type="submit" id="register-submit" disabled={isLoading} className="btn btn-primary btn-lg" style={{ flex: 1 }}>
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }} className="animate-spin" />
                        Creating...
                      </span>
                    ) : 'Create Account'}
                  </button>
                </div>

                <div className="flex items-center gap-4 my-6">
                  <div className="h-px bg-slate-200 flex-1"></div>
                  <span className="text-sm text-slate-400 font-medium">OR</span>
                  <div className="h-px bg-slate-200 flex-1"></div>
                </div>

                <div className="flex justify-center w-full">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => toast.error('Google Sign-In failed.')}
                    theme="outline"
                    size="large"
                    width="100%"
                    text="continue_with"
                  />
                </div>
              </motion.div>
            )}
          </form>

          <p className="text-center" style={{ color: '#9ca3af', fontSize: 14, marginTop: 24 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#6366f1', fontWeight: 700 }}>Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
