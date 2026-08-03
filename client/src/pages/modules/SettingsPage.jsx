import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { User, Lock, Camera, Save, Eye, EyeOff, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'password', label: 'Change Password', icon: Lock },
];

const ROLE_COLORS = {
  resident: '#6366f1', committee: '#7c3aed', security: '#2563eb',
  maintenance: '#d97706', vendor: '#059669',
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your account preferences</p>
      </div>

      {
      <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl w-fit">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                background: activeTab === tab.id ? '#ffffff' : 'transparent',
                color: activeTab === tab.id ? '#0f172a' : '#64748b',
                boxShadow: activeTab === tab.id ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'profile' ? <ProfileTab /> : <PasswordTab />}
      </motion.div>
    </div>
  );
}

function ProfileTab() {
  const { user, setUser } = useAuthStore();
  const accentColor = ROLE_COLORS[user?.role] || '#6366f1';

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    flatNumber: user?.flatNumber || '',
    tower: user?.tower || '',
  });

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: (data) => api.patch('/users/profile', data),
    onSuccess: (res) => {
      if (res?.data) setUser({ ...user, ...res.data });
      toast.success('Profile updated successfully!');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update profile'),
  });

  const { mutate: uploadAvatar, isPending: isUploadingAvatar } = useMutation({
    mutationFn: (formData) => api.patch('/users/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    onSuccess: (res) => {
      if (res?.data?.avatarUrl) setUser({ ...user, avatarUrl: res.data.avatarUrl });
      toast.success('Avatar updated!');
    },
    onError: () => toast.error('Failed to upload avatar'),
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('avatar', file);
    uploadAvatar(fd);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(form);
  };

  const avatarUrl = user?.avatarUrl
    ? (user.avatarUrl.startsWith('http') ? user.avatarUrl : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${user.avatarUrl}`)
    : null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {
      <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-center gap-5">
        <div className="relative">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)` }}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <>{user?.firstName?.[0]}{user?.lastName?.[0]}</>
            )}
          </div>
          <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border-2 border-slate-200 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-50 shadow-sm transition-colors">
            {isUploadingAvatar ? (
              <div className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Camera size={13} className="text-slate-600" />
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </label>
        </div>
        <div>
          <div className="font-bold text-slate-900 text-lg">{user?.firstName} {user?.lastName}</div>
          <div className="text-sm text-slate-500">{user?.email}</div>
          <div className="mt-1.5">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: `${accentColor}15`, color: accentColor }}>
              {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="form-group mb-0">
            <label className="label">First Name</label>
            <input className="input" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          </div>
          <div className="form-group mb-0">
            <label className="label">Last Name</label>
            <input className="input" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </div>
        </div>

        <div className="form-group mb-0">
          <label className="label">Phone</label>
          <input className="input" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="form-group mb-0">
            <label className="label">Tower</label>
            <input className="input" placeholder="A, B, C..." value={form.tower} onChange={(e) => setForm({ ...form, tower: e.target.value })} />
          </div>
          <div className="form-group mb-0">
            <label className="label">Flat Number</label>
            <input className="input font-mono" placeholder="101, 202..." value={form.flatNumber} onChange={(e) => setForm({ ...form, flatNumber: e.target.value })} />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button type="submit" disabled={isPending} className="btn btn-primary">
            {isPending ? (
              <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving...</>
            ) : (
              <><Save size={16} /> Save Changes</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function PasswordTab() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [success, setSuccess] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => api.patch('/users/change-password', data),
    onSuccess: () => {
      toast.success('Password changed successfully!');
      setSuccess(true);
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccess(false), 3000);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to change password'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.currentPassword || !form.newPassword) return toast.error('Please fill all fields');
    if (form.newPassword !== form.confirmPassword) return toast.error('New passwords do not match');
    if (form.newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    mutate({ currentPassword: form.currentPassword, newPassword: form.newPassword });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h3 className="font-bold text-slate-900">Change Password</h3>
        <p className="text-sm text-slate-500 mt-1">Your password must be at least 6 characters</p>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {[
          { key: 'currentPassword', label: 'Current Password', show: showCurrent, toggle: () => setShowCurrent(!showCurrent) },
          { key: 'newPassword', label: 'New Password', show: showNew, toggle: () => setShowNew(!showNew) },
          { key: 'confirmPassword', label: 'Confirm New Password', show: showNew, toggle: () => setShowNew(!showNew) },
        ].map(({ key, label, show, toggle }) => (
          <div key={key} className="form-group mb-0">
            <label className="label">{label}</label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                className="input pr-10"
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder="••••••••"
              />
              <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        ))}

        <div className="pt-2 flex justify-end">
          <button type="submit" disabled={isPending} className={`btn flex items-center gap-2 ${success ? 'btn-ghost' : 'btn-primary'}`}>
            {success ? (
              <><Check size={16} className="text-emerald-500" /> Changed!</>
            ) : isPending ? (
              <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Updating...</>
            ) : (
              <><Lock size={16} /> Update Password</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
