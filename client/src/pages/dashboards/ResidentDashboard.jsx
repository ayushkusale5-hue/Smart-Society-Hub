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
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 16 }}>
          {label}
        </p>
        <div style={{ fontSize: 40, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.025em', lineHeight: 1, marginBottom: 12 }}>{value}</div>
        {sub && <p style={{ fontSize: 14, color: '#64748b', marginTop: 4, fontWeight: 500 }}>{sub}</p>}
      </div>
      <div style={{ width: 64, height: 64, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: `${color}10`, border: `2px solid ${color}20` }}>
        <Icon size={28} style={{ color }} />
      </div>
    </div>
  </motion.div>
);

const QuickAction = ({ icon: Icon, label, to, color, desc }) => (
  <Link to={to} style={{ textDecoration: 'none' }}>
    <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
      style={{ background: '#ffffff', border: '1.5px solid #e8ecf4', borderRadius: 24, padding: '32px', cursor: 'pointer', transition: 'all 0.25s ease', display: 'flex', alignItems: 'center', gap: 24 }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = color + '40'; e.currentTarget.style.boxShadow = `0 12px 32px ${color}14`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8ecf4'; e.currentTarget.style.boxShadow = 'none'; }}>
      <div style={{ width: 64, height: 64, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: `${color}10`, border: `2px solid ${color}18` }}>
        <Icon size={28} style={{ color }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>{label}</div>
        <div style={{ fontSize: 15, color: '#64748b', lineHeight: 1.5 }}>{desc}</div>
      </div>
      <ChevronRight size={24} style={{ color: '#cbd5e1', flexShrink: 0 }} />
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }} className="animate-fade-in">

      {/* ── Welcome Banner ─────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{ padding: '56px 64px', borderRadius: 32, position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #4338ca 100%)', boxShadow: '0 24px 64px rgba(99,102,241,0.3)' }}>
        <div style={{ position: 'absolute', width: 450, height: 450, borderRadius: '50%', top: -150, right: -100, background: 'radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', bottom: -100, left: 300, background: 'radial-gradient(circle, rgba(168,85,247,0.25), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32 }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, marginBottom: 12, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Welcome back</p>
            <h2 style={{ fontSize: 48, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 20 }}>
              {user?.firstName} {user?.lastName}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.15)', padding: '8px 20px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.2)' }}>
                <Home size={16} /> Flat {user?.flatNumber || 'N/A'}
              </span>
              {user?.tower && (
                <span style={{ fontSize: 16, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>• {user.tower}</span>
              )}
              <span style={{ fontSize: 16, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>• Resident</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Today</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'rgba(255,255,255,0.95)' }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Stats ──────────────────────────────────────────────────── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Overview</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 stagger-children">
          {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>
      </div>

      {/* ── Quick Actions + Activity ────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-8 items-start">
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 24 }}>Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 stagger-children">
            {quickActions.map((a) => <QuickAction key={a.label} {...a} />)}
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 24 }}>Recent Activity</h3>
          <div style={{ background: '#ffffff', border: '1px solid #e8ecf4', borderRadius: 32, padding: '16px 0', boxShadow: '0 4px 24px rgba(0,0,0,0.03)' }}>
            {recentActivity.map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 * i }}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 20, padding: '24px 32px', borderBottom: i < recentActivity.length - 1 ? '1px solid #f4f6fb' : 'none' }}>
                <div style={{ width: 48, height: 48, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: `${item.color}10`, border: `2px solid ${item.color}18` }}>
                  <item.icon size={22} style={{ color: item.color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 16, fontWeight: 600, color: '#334155', lineHeight: 1.5 }}>{item.msg}</p>
                  <p style={{ fontSize: 14, fontWeight: 500, color: '#94a3b8', marginTop: 6 }}>{item.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Notices ────────────────────────────────────────────────── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Notices & Events</h3>
          <Link to="/notices" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 15, fontWeight: 700, color: '#6366f1', textDecoration: 'none' }}>
            View all <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {notices.map((item, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * i }}
              style={{ background: '#ffffff', border: '1px solid #e8ecf4', borderRadius: 28, padding: '36px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', transition: 'all 0.2s ease', cursor: 'pointer' }}
              whileHover={{ y: -4, boxShadow: '0 12px 36px rgba(0,0,0,0.08)', borderColor: '#c7d2fe' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700, color: item.iconColor, background: `${item.iconColor}15`, padding: '6px 16px', borderRadius: 99 }}>
                  <item.icon size={16} /> {item.type}
                </span>
                {item.urgent && (
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#dc2626', background: '#fef2f2', padding: '6px 16px', borderRadius: 99, border: '1px solid #fecaca' }}>
                    URGENT
                  </span>
                )}
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 16, lineHeight: 1.3 }}>{item.title}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 500, color: '#64748b' }}>
                <Clock size={16} /> {item.time}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
