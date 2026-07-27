import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import {
  Users, Wrench, FileText, TrendingUp, AlertTriangle,
  Car, CheckCircle, Clock, Bell, BarChart3, Building2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const monthlyData = [
  { month: 'Feb', complaints: 12, resolved: 9, revenue: 45000 },
  { month: 'Mar', complaints: 19, resolved: 15, revenue: 52000 },
  { month: 'Apr', complaints: 8, resolved: 7, revenue: 48000 },
  { month: 'May', complaints: 15, resolved: 12, revenue: 55000 },
  { month: 'Jun', complaints: 22, resolved: 18, revenue: 60000 },
  { month: 'Jul', complaints: 11, resolved: 9, revenue: 58000 },
];

const complaintCategories = [
  { name: 'Plumbing', value: 35, color: '#6366f1' },
  { name: 'Electrical', value: 25, color: '#a855f7' },
  { name: 'Civil', value: 20, color: '#3b82f6' },
  { name: 'Security', value: 12, color: '#f59e0b' },
  { name: 'Other', value: 8, color: '#22c55e' },
];

const StatCard = ({ icon: Icon, label, value, sub, color, change, delay }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className="stat-card">
    <div className="flex items-start justify-between mb-3">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ background: `${color}10`, border: `1px solid ${color}20` }}>
        <Icon size={20} style={{ color }} />
      </div>
      {change && (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
          change > 0 ? 'text-green-700 bg-green-50 border border-green-200' : 'text-red-700 bg-red-50 border border-red-200'
        }`}>
          {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
        </span>
      )}
    </div>
    <div className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{value}</div>
    <div className="text-xs font-semibold uppercase tracking-wide mt-1.5" style={{ color: 'var(--color-text-secondary)' }}>{label}</div>
    {sub && <div className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{sub}</div>}
  </motion.div>
);

export default function CommitteeDashboard() {
  const { user } = useAuthStore();

  const stats = [
    { icon: Users, label: 'Total Residents', value: '248', sub: '12 pending approval', color: '#6366f1', change: 5, delay: 0.1 },
    { icon: Wrench, label: 'Open Complaints', value: '14', sub: '3 urgent', color: '#d97706', change: -8, delay: 0.15 },
    { icon: FileText, label: 'Monthly Revenue', value: '₹5.8L', sub: 'Jul 2026', color: '#16a34a', change: 12, delay: 0.2 },
    { icon: AlertTriangle, label: 'Security Incidents', value: '2', sub: 'This month', color: '#dc2626', change: -50, delay: 0.25 },
    { icon: Car, label: 'Parking Slots', value: '38/50', sub: '12 available', color: '#2563eb', change: null, delay: 0.3 },
    { icon: Building2, label: 'Facility Bookings', value: '7', sub: 'This week', color: '#7c3aed', change: 20, delay: 0.35 },
    { icon: TrendingUp, label: 'Collection Rate', value: '94%', sub: '₹23K pending', color: '#059669', change: 2, delay: 0.4 },
    { icon: CheckCircle, label: 'Complaints Resolved', value: '82%', sub: 'This month', color: '#db2777', change: 5, delay: 0.45 },
  ];

  const pendingActions = [
    { type: 'approval', msg: 'Priya Sharma — Resident approval pending', time: '2h ago', priority: 'high' },
    { type: 'complaint', msg: 'Complaint #C-041 — Elevator breakdown (Urgent)', time: '4h ago', priority: 'urgent' },
    { type: 'booking', msg: 'Clubhouse booking approval — Mr. Rajan', time: '6h ago', priority: 'normal' },
    { type: 'vendor', msg: 'Vendor invoice pending review — CleanCo', time: '1d ago', priority: 'normal' },
    { type: 'payment', msg: '14 residents have overdue maintenance bills', time: '2d ago', priority: 'high' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, white, transparent)' }} />
        <div className="relative flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge badge-primary bg-white/20 text-white border-white/30">Committee Member</span>
            </div>
            <h2 className="text-2xl font-bold text-white">{user?.firstName} {user?.lastName}</h2>
            <p className="text-indigo-200 text-sm mt-1">Society Administration Dashboard</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/notices/manage" className="btn bg-white/20 hover:bg-white/30 text-white border border-white/30 btn-sm">
              <Bell size={14} /> Post Notice
            </Link>
            <Link to="/polls/manage" className="btn bg-white text-indigo-700 hover:bg-gray-50 border border-white btn-sm">
              Create Poll
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-muted)' }}>Society Overview</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
          {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>
      </div>

      {/* Charts + Pending Actions */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Complaints trend chart */}
        <div className="lg:col-span-2 card">
          <h3 className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>Complaints Trend</h3>
          <p className="text-xs mb-5" style={{ color: 'var(--color-text-muted)' }}>Monthly raised vs resolved</p>
          <div style={{ height: '220px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradRaised" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '12px' }}
                  itemStyle={{ padding: '2px 0' }}
                />
                <Area type="monotone" dataKey="complaints" stroke="#6366f1" strokeWidth={2} fill="url(#gradRaised)" name="Raised" activeDot={{ r: 4, strokeWidth: 0 }} />
                <Area type="monotone" dataKey="resolved" stroke="#16a34a" strokeWidth={2} fill="url(#gradResolved)" name="Resolved" activeDot={{ r: 4, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Complaint categories pie */}
        <div className="card flex flex-col">
          <h3 className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>By Category</h3>
          <p className="text-xs mb-3" style={{ color: 'var(--color-text-muted)' }}>This month</p>
          <div className="flex-1 flex flex-col justify-center">
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie data={complaintCategories} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                  dataKey="value" paddingAngle={2} stroke="none">
                  {complaintCategories.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }} itemStyle={{ color: '#0f172a' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4 px-2">
              {complaintCategories.map((c) => (
                <div key={c.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                    <span style={{ color: 'var(--color-text-secondary)' }}>{c.name}</span>
                  </div>
                  <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pending actions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Pending Actions</h3>
          <span className="badge badge-warning">{pendingActions.length} items</span>
        </div>
        <div className="card p-0 overflow-hidden divide-y" style={{ borderColor: 'var(--border-color)' }}>
          {pendingActions.map((action, i) => (
            <div key={i} className="flex items-center justify-between p-4 transition-colors hover:bg-slate-50">
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${
                  action.priority === 'urgent' ? 'bg-red-500' :
                  action.priority === 'high' ? 'bg-amber-500' : 'bg-blue-400'
                }`} />
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{action.msg}</p>
                  <p className="text-xs flex items-center gap-1 mt-1" style={{ color: 'var(--color-text-muted)' }}>
                    <Clock size={12} /> {action.time}
                  </p>
                </div>
              </div>
              <button className="btn btn-secondary btn-sm whitespace-nowrap ml-4">Review</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
