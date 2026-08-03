import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import {
  Users, Wrench, FileText, Calendar, Car, Bell, ShoppingBag,
  AlertCircle, CheckCircle, Clock, Home, Vote,
  ChevronRight, ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ icon: Icon, label, value, sub, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.45 }}
    className="stat-card">
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>
          {label}
        </p>
        <div style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.025em', lineHeight: 1, marginBottom: 8 }}>{value}</div>
        {sub && <p style={{ fontSize: 13, color: '#64748b', marginTop: 4, fontWeight: 500 }}>{sub}</p>}
      </div>
      <div style={{ width: 52, height: 52, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: `${color}10`, border: `2px solid ${color}20`, marginLeft: 12 }}>
        <Icon size={24} style={{ color }} />
      </div>
    </div>
  </motion.div>
);

const QuickAction = ({ icon: Icon, label, to, color, desc }) => (
  <Link to={to} style={{ textDecoration: 'none' }}>
    <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
      className="quick-action-card"
      onMouseEnter={e => { e.currentTarget.style.borderColor = color + '40'; e.currentTarget.style.boxShadow = `0 8px 24px ${color}14`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8ecf4'; e.currentTarget.style.boxShadow = 'none'; }}>
      <div style={{ width: 52, height: 52, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: `${color}10`, border: `2px solid ${color}18` }}>
        <Icon size={24} style={{ color }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.4 }}>{desc}</div>
      </div>
      <ChevronRight size={20} style={{ color: '#cbd5e1', flexShrink: 0 }} />
    </motion.div>
  </Link>
);

export default function ResidentDashboard() {
  const { user } = useAuthStore();

  const stats = [
    { icon: Users,    label: 'Active Visitors',  value: '2',      sub: '1 expected today',      color: '#6366f1', delay: 0.08 },
    { icon: Wrench,   label: 'Open Complaints',  value: '1',      sub: 'Plumbing — In Progress', color: '#d97706', delay: 0.14 },
    { icon: FileText, label: 'Maintenance Due',  value: '₹2,500', sub: 'Due in 5 days',          color: '#dc2626', delay: 0.20 },
    { icon: Calendar, label: 'Upcoming Events',  value: '3',      sub: 'Next: Society Meet',     color: '#16a34a', delay: 0.26 },
  ];

  const quickActions = [
    { icon: Users,        label: 'Invite Visitor',   to: '/visitors',    color: '#6366f1', desc: 'Generate a QR visitor pass' },
    { icon: Wrench,       label: 'Raise Complaint',  to: '/complaints',  color: '#d97706', desc: 'Report a maintenance issue' },
    { icon: Car,          label: 'Book Parking',     to: '/parking',     color: '#2563eb', desc: 'Reserve a guest parking slot' },
    { icon: Calendar,     label: 'Book Facility',    to: '/facilities',  color: '#16a34a', desc: 'Club house, gym, pool & more' },
    { icon: ShoppingBag,  label: 'Marketplace',      to: '/marketplace', color: '#7c3aed', desc: 'Buy, sell or exchange items' },
    { icon: AlertCircle,  label: 'Emergency SOS',    to: '/sos',         color: '#dc2626', desc: 'Alert security & committee' },
  ];

  const recentActivity = [
    { msg: 'Visitor Rahul approved — Entry at 3:45 PM', time: '2h ago', icon: CheckCircle, color: '#16a34a' },
    { msg: 'Complaint #C-034 updated to In Progress',   time: '5h ago', icon: Clock,       color: '#d97706' },
    { msg: 'New notice: Water supply interruption tomorrow', time: '1d ago', icon: Bell,  color: '#6366f1' },
    { msg: 'New poll: Society renovation — Vote now',   time: '2d ago', icon: Vote,       color: '#7c3aed' },
  ];

  const notices = [
    { icon: Bell,     iconColor: '#6366f1', type: 'Notice',  title: 'Water Supply Interruption',    time: 'Tomorrow, 10 AM – 2 PM', urgent: true },
    { icon: Calendar, iconColor: '#16a34a', type: 'Event',   title: 'Independence Day Celebration', time: 'Aug 15, 6 PM at Clubhouse', urgent: false },
    { icon: Vote,     iconColor: '#7c3aed', type: 'Poll',    title: 'Vote: New Gym Equipment',      time: 'Closes in 3 days', urgent: false },
  ];

  return (
    <div className="flex flex-col gap-8">

      {
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="welcome-banner"
        style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #4338ca 100%)', boxShadow: '0 20px 48px rgba(99,102,241,0.3)' }}>
        <div style={{ position: 'absolute', width: 350, height: 350, borderRadius: '50%', top: -120, right: -80, background: 'radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%)', pointerEvents: 'none' }} />
        <div className="welcome-banner-inner">
          <div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 8, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Welcome back</p>
            <h2 className="welcome-banner-title">{user?.firstName} {user?.lastName}</h2>
            <div className="flex flex-wrap items-center gap-3">
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.15)', padding: '6px 16px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.2)' }}>
                <Home size={14} /> Flat {user?.flatNumber || 'N/A'}
              </span>
              {user?.tower && <span style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>• {user.tower}</span>}
              <span style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>• Resident</span>
            </div>
          </div>
          <div className="hidden sm:block" style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Today</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'rgba(255,255,255,0.95)' }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>
      </motion.div>

      {
      <div>
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-5">Overview</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>
      </div>

      {
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 items-start">
        <div>
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-5">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((a) => <QuickAction key={a.label} {...a} />)}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-5">Recent Activity</h3>
          <div style={{ background: '#ffffff', border: '1px solid #e8ecf4', borderRadius: 24, padding: '8px 0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            {recentActivity.map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 * i }}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 20px', borderBottom: i < recentActivity.length - 1 ? '1px solid #f4f6fb' : 'none' }}>
                <div style={{ width: 40, height: 40, borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: `${item.color}10`, border: `2px solid ${item.color}18` }}>
                  <item.icon size={18} style={{ color: item.color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#334155', lineHeight: 1.4 }}>{item.msg}</p>
                  <p style={{ fontSize: 12, fontWeight: 500, color: '#94a3b8', marginTop: 4 }}>{item.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {
      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Notices & Events</h3>
          <Link to="/notices" className="flex items-center gap-1.5 text-sm font-bold text-indigo-600" style={{ textDecoration: 'none' }}>
            View all <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {notices.map((item, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * i }}
              style={{ background: '#ffffff', border: '1px solid #e8ecf4', borderRadius: 22, padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', transition: 'all 0.2s ease', cursor: 'pointer' }}
              whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.08)', borderColor: '#c7d2fe' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: item.iconColor, background: `${item.iconColor}15`, padding: '5px 12px', borderRadius: 99 }}>
                  <item.icon size={14} /> {item.type}
                </span>
                {item.urgent && (
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#dc2626', background: '#fef2f2', padding: '4px 10px', borderRadius: 99, border: '1px solid #fecaca' }}>
                    URGENT
                  </span>
                )}
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', marginBottom: 10, lineHeight: 1.3 }}>{item.title}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: '#64748b' }}>
                <Clock size={13} /> {item.time}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
