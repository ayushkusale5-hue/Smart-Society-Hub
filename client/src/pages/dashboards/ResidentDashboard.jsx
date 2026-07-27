import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import {
  Users, Wrench, FileText, Calendar, Car, Bell, ShoppingBag,
  AlertCircle, CheckCircle, Clock, Star, TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ icon: Icon, label, value, sub, color, delay }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className="stat-card">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-1"
          style={{ color: 'var(--color-text-muted)' }}>{label}</p>
        <div className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{value}</div>
        {sub && <p className="text-xs mt-1.5" style={{ color: 'var(--color-text-muted)' }}>{sub}</p>}
      </div>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}12`, border: `1px solid ${color}20` }}>
        <Icon size={22} style={{ color }} />
      </div>
    </div>
  </motion.div>
);

const QuickAction = ({ icon: Icon, label, to, color, desc }) => (
  <Link to={to}>
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
      className="glass-card p-4 cursor-pointer flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}10`, border: `1px solid ${color}18` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div>
        <div className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>{label}</div>
        <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{desc}</div>
      </div>
    </motion.div>
  </Link>
);

export default function ResidentDashboard() {
  const { user } = useAuthStore();

  const stats = [
    { icon: Users, label: 'Active Visitors', value: '2', sub: '1 expected today', color: '#6366f1', delay: 0.1 },
    { icon: Wrench, label: 'Open Complaints', value: '1', sub: 'Plumbing — In Progress', color: '#d97706', delay: 0.15 },
    { icon: FileText, label: 'Maintenance Due', value: '₹2,500', sub: 'Due in 5 days', color: '#dc2626', delay: 0.2 },
    { icon: Calendar, label: 'Upcoming Events', value: '3', sub: 'Next: Society Meet', color: '#16a34a', delay: 0.25 },
  ];

  const quickActions = [
    { icon: Users, label: 'Invite Visitor', to: '/visitors', color: '#6366f1', desc: 'Generate a QR visitor pass' },
    { icon: Wrench, label: 'Raise Complaint', to: '/complaints', color: '#d97706', desc: 'Report a maintenance issue' },
    { icon: Car, label: 'Book Parking', to: '/parking', color: '#2563eb', desc: 'Reserve a guest parking slot' },
    { icon: Calendar, label: 'Book Facility', to: '/facilities', color: '#16a34a', desc: 'Club house, gym, pool & more' },
    { icon: ShoppingBag, label: 'Marketplace', to: '/marketplace', color: '#7c3aed', desc: 'Buy, sell or exchange items' },
    { icon: AlertCircle, label: 'Emergency SOS', to: '/sos', color: '#dc2626', desc: 'Alert security & committee' },
  ];

  const recentActivity = [
    { type: 'visitor', msg: 'Visitor Rahul approved — Entry at 3:45 PM', time: '2h ago', icon: CheckCircle, color: '#16a34a' },
    { type: 'complaint', msg: 'Complaint #C-034 updated to In Progress', time: '5h ago', icon: Clock, color: '#d97706' },
    { type: 'notice', msg: 'New notice: Water supply interruption tomorrow', time: '1d ago', icon: Bell, color: '#6366f1' },
    { type: 'poll', msg: 'New poll: Society renovation plans — Vote now', time: '2d ago', icon: Star, color: '#7c3aed' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome banner */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
        }}>
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, white, transparent)' }} />
        <div className="relative">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-indigo-200 text-sm font-medium mb-1">Welcome back! 👋</p>
              <h2 className="text-2xl font-bold text-white">{user?.firstName} {user?.lastName}</h2>
              <div className="flex items-center gap-3 mt-2 text-sm text-indigo-200">
                <span>🏠 Flat {user?.flatNumber || 'N/A'}</span>
                {user?.tower && <span>• {user.tower}</span>}
                <span>• Resident</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-indigo-200">Today</div>
              <div className="text-white font-semibold">{new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-muted)' }}>Overview</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
          {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>
      </div>

      {/* Quick Actions + Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-muted)' }}>Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3 stagger-children">
            {quickActions.map((a) => <QuickAction key={a.label} {...a} />)}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-muted)' }}>Recent Activity</h3>
          <div className="card space-y-4">
            {recentActivity.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 * i }}
                className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: `${item.color}10` }}>
                  <item.icon size={14} style={{ color: item.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-snug" style={{ color: 'var(--color-text-secondary)' }}>{item.msg}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{item.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Notices */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Notices & Events</h3>
          <Link to="/notices" className="text-xs font-semibold" style={{ color: '#6366f1' }}>View all →</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { type: '📢 Notice', title: 'Water Supply Interruption', time: 'Tomorrow, 10 AM – 2 PM', urgent: true },
            { type: '🎉 Event', title: 'Independence Day Celebration', time: 'Aug 15, 6 PM at Clubhouse', urgent: false },
            { type: '🗳️ Poll', title: 'Vote: New Gym Equipment', time: 'Closes in 3 days', urgent: false },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }} className="card">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{item.type}</span>
                {item.urgent && <span className="badge badge-error">Urgent</span>}
              </div>
              <div className="font-semibold text-sm mb-1.5" style={{ color: 'var(--color-text-primary)' }}>{item.title}</div>
              <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                <Clock size={10} /> {item.time}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
