import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import {
  Users, Wrench, FileText, TrendingUp, AlertTriangle,
  Car, CheckCircle, Clock, Bell, BarChart3, Building2, ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../../services/analytics.service';



const StatCard = ({ icon: Icon, label, value, sub, color, change, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.45 }}
    className="stat-card">
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
      <div style={{ width: 50, height: 50, borderRadius: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${color}10`, border: `1.5px solid ${color}22` }}>
        <Icon size={22} style={{ color }} />
      </div>
      {change != null && (
        <span style={{
          fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 99,
          color: change > 0 ? '#15803d' : '#b91c1c',
          background: change > 0 ? '#f0fdf4' : '#fef2f2',
          border: `1px solid ${change > 0 ? '#bbf7d0' : '#fecaca'}`
        }}>
          {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
        </span>
      )}
    </div>
    <div style={{ fontSize: 30, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.025em', lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 10 }}>{label}</div>
    {sub && <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 6 }}>{sub}</div>}
  </motion.div>
);

export default function CommitteeDashboard() {
  const { user } = useAuthStore();

  const { data: analyticsRes, isLoading } = useQuery({
    queryKey: ['committee-analytics'],
    queryFn: () => analyticsService.getCommitteeAnalytics(),
  });

  const analytics = analyticsRes?.data || {
    trends: [],
    categories: [],
    overview: { totalComplaints: 0, openComplaints: 0, visitorsToday: 0 }
  };

  const monthlyData = analytics.trends;
  const complaintCategories = analytics.categories;
  const totalCatValue = complaintCategories.reduce((acc, c) => acc + c.value, 0) || 1;

  const stats = [
    { icon: Users,         label: 'Active Residents',    value: '248',  sub: '12 pending approval', color: '#6366f1', change: 5,    delay: 0.06 },
    { icon: Wrench,        label: 'Open Complaints',     value: analytics.overview.openComplaints, sub: `${analytics.overview.totalComplaints} total`, color: '#d97706', delay: 0.10 },
    { icon: Users,         label: 'Visitors Today',      value: analytics.overview.visitorsToday, sub: 'Gate flow', color: '#16a34a', change: 12,   delay: 0.14 },
    { icon: AlertTriangle, label: 'Security Incidents',  value: '2',    sub: 'This month',           color: '#dc2626', change: -50,  delay: 0.18 },
    { icon: Car,           label: 'Parking Slots',       value: '38/50',sub: '12 available',         color: '#2563eb', change: null, delay: 0.22 },
    { icon: Building2,     label: 'Facility Bookings',   value: '7',    sub: 'This week',            color: '#7c3aed', change: 20,   delay: 0.26 },
    { icon: TrendingUp,    label: 'Collection Rate',     value: '94%',  sub: '₹23K pending',        color: '#059669', change: 2,    delay: 0.30 },
    { icon: CheckCircle,   label: 'Complaints Resolved', value: '82%',  sub: 'This month',           color: '#db2777', change: 5,    delay: 0.34 },
  ];

  const pendingActions = [
    { msg: 'Priya Sharma — Resident approval pending',        time: '2h ago', priority: 'high' },
    { msg: 'Complaint #C-041 — Elevator breakdown (Urgent)',  time: '4h ago', priority: 'urgent' },
    { msg: 'Clubhouse booking approval — Mr. Rajan',          time: '6h ago', priority: 'normal' },
    { msg: 'Vendor invoice pending review — CleanCo',         time: '1d ago', priority: 'normal' },
    { msg: '14 residents have overdue maintenance bills',     time: '2d ago', priority: 'high' },
  ];

  const priorityColor = { urgent: '#ef4444', high: '#f59e0b', normal: '#3b82f6' };
  const priorityLabel = { urgent: 'Urgent', high: 'High', normal: 'Normal' };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">

      {
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="welcome-banner"
        style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #4f46e5 100%)', boxShadow: '0 16px 48px rgba(124,58,237,0.3)' }}>
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', top: -100, right: -60, background: 'radial-gradient(circle, rgba(255,255,255,0.07), transparent 70%)', pointerEvents: 'none' }} />
        <div className="welcome-banner-inner">
          <div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.12)', padding: '5px 14px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.18)', marginBottom: 12 }}>
              Committee Member
            </span>
            <h2 className="welcome-banner-title">{user?.firstName} {user?.lastName}</h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>Society Administration Dashboard</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link to="/notices/manage" className="btn btn-md"
              style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}>
              <Bell size={14} /> Post Notice
            </Link>
            <Link to="/polls/manage" className="btn btn-md"
              style={{ background: '#ffffff', color: '#6d28d9', fontWeight: 700 }}>
              Create Poll
            </Link>
          </div>
        </div>
      </motion.div>

      {
      <div>
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-5">Society Overview</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
          {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>
      </div>

      {
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 items-start">
        {
        <div style={{ background: '#ffffff', border: '1px solid #e8ecf4', borderRadius: 24, padding: '32px', boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}>
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.015em' }}>Complaints Trend</h3>
            <p style={{ fontSize: 13.5, color: '#9ca3af', marginTop: 4 }}>Monthly raised vs. resolved</p>
          </div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradRaised" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#16a34a" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#ffffff', border: '1px solid #e8ecf4', borderRadius: 14, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', fontSize: 13, padding: '12px 16px' }}
                  itemStyle={{ padding: '2px 0' }} />
                <Area type="monotone" dataKey="complaints" stroke="#6366f1" strokeWidth={2.5} fill="url(#gradRaised)" name="Raised" activeDot={{ r: 5, strokeWidth: 0, fill: '#6366f1' }} />
                <Area type="monotone" dataKey="resolved"   stroke="#16a34a" strokeWidth={2.5} fill="url(#gradResolved)" name="Resolved" activeDot={{ r: 5, strokeWidth: 0, fill: '#16a34a' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {
        <div style={{ background: '#ffffff', border: '1px solid #e8ecf4', borderRadius: 24, padding: '32px', boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}>
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.015em' }}>By Category</h3>
            <p style={{ fontSize: 13.5, color: '#9ca3af', marginTop: 4 }}>This month</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={complaintCategories} cx="50%" cy="50%" innerRadius={52} outerRadius={80} dataKey="value" paddingAngle={3} stroke="none">
                {complaintCategories.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e8ecf4', borderRadius: 12, fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
            {complaintCategories.slice(0, 4).map((c) => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13.5, color: '#374151' }}>{c.name}</span>
                </div>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0f172a' }}>{Math.round((c.value / totalCatValue) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontSize: 11.5, fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pending Actions</h3>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#b45309', background: '#fffbeb', padding: '4px 12px', borderRadius: 99, border: '1px solid #fde68a' }}>
            {pendingActions.length} items
          </span>
        </div>
        <div style={{ background: '#ffffff', border: '1px solid #e8ecf4', borderRadius: 24, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}>
          {pendingActions.map((action, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 28px', borderBottom: i < pendingActions.length - 1 ? '1px solid #f4f6fb' : 'none', transition: 'background 0.15s ease' }}
              onMouseEnter={e => e.currentTarget.style.background = '#fafbff'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: priorityColor[action.priority] }} />
                </div>
                <div>
                  <p style={{ fontSize: 14.5, fontWeight: 600, color: '#0f172a' }}>{action.msg}</p>
                  <p style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: '#9ca3af', marginTop: 5 }}>
                    <Clock size={12} /> {action.time}
                    <span style={{ marginLeft: 8, fontSize: 11.5, fontWeight: 700, color: priorityColor[action.priority], background: `${priorityColor[action.priority]}12`, padding: '2px 8px', borderRadius: 99 }}>
                      {priorityLabel[action.priority]}
                    </span>
                  </p>
                </div>
              </div>
              <button className="btn btn-secondary btn-sm" style={{ marginLeft: 16, whiteSpace: 'nowrap' }}>Review</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
