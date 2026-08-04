import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Users, Wrench, Shield, Car, AlertTriangle, Eye, CheckCircle, TrendingUp, BarChart3 } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { analyticsService } from '../../services/analytics.service';

const StatCard = ({ icon: Icon, label, value, sub, color, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }} className="stat-card">
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${color}10`, border: `1.5px solid ${color}22` }}>
        <Icon size={22} style={{ color }} />
      </div>
    </div>
    <div className="text-3xl font-black text-slate-900 tracking-tight">{value}</div>
    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">{label}</div>
    {sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
  </motion.div>
);

export default function AnalyticsDashboard() {
  const { data: res, isLoading } = useQuery({
    queryKey: ['full-analytics'],
    queryFn: () => analyticsService.getFullAnalytics(),
  });

  const analytics = res?.data || { overview: {}, complaintTrend: [], visitorTrend: [], categories: [] };
  const o = analytics.overview;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h1></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-100/50 rounded-2xl animate-pulse" />)}</div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">{[1,2].map(i => <div key={i} className="h-80 bg-slate-100/50 rounded-2xl animate-pulse" />)}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Analytics Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Comprehensive society overview and insights</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Residents" value={o.totalResidents || 0} sub={`${o.activeResidents || 0} active`} color="#6366f1" delay={0.05} />
        <StatCard icon={Wrench} label="Open Complaints" value={o.openComplaints || 0} sub={`${o.totalComplaints || 0} total`} color="#ea580c" delay={0.1} />
        <StatCard icon={Eye} label="Visitors This Month" value={o.visitorsThisMonth || 0} sub={`${o.visitorsToday || 0} today`} color="#2563eb" delay={0.15} />
        <StatCard icon={AlertTriangle} label="Open Incidents" value={o.openIncidents || 0} sub={`${o.totalIncidents || 0} total`} color="#dc2626" delay={0.2} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={Car} label="Vehicles Today" value={o.vehiclesToday || 0} color="#0ea5e9" delay={0.25} />
        <StatCard icon={Shield} label="Active SOS" value={o.activeSos || 0} sub={`${o.totalSos || 0} total`} color="#dc2626" delay={0.3} />
        <StatCard icon={CheckCircle} label="Resolved Complaints" value={o.resolvedComplaints || 0} color="#16a34a" delay={0.35} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Complaint Trends */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2"><TrendingUp size={16} className="text-indigo-500" /> Complaint Trends</h3>
          <p className="text-xs text-slate-400 mb-6">Last 6 months</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={analytics.complaintTrend}>
              <defs>
                <linearGradient id="colorComplaints" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
              <Area type="monotone" dataKey="complaints" stroke="#6366f1" strokeWidth={2} fill="url(#colorComplaints)" name="Total" />
              <Area type="monotone" dataKey="resolved" stroke="#16a34a" strokeWidth={2} fill="url(#colorResolved)" name="Resolved" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Visitor Trends */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2"><BarChart3 size={16} className="text-blue-500" /> Visitor Trends</h3>
          <p className="text-xs text-slate-400 mb-6">Last 6 months</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={analytics.visitorTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
              <Bar dataKey="visitors" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Visitors" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Complaint Categories Pie */}
      {analytics.categories.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-6">Complaint Categories</h3>
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <ResponsiveContainer width={260} height={260}>
              <PieChart>
                <Pie data={analytics.categories} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} innerRadius={60} paddingAngle={3}>
                  {analytics.categories.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-3 flex-1">
              {analytics.categories.map(cat => (
                <div key={cat.name} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                  <div>
                    <div className="text-sm font-bold text-slate-700">{cat.name}</div>
                    <div className="text-xs text-slate-400">{cat.value} complaints</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
