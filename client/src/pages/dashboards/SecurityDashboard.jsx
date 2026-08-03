import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { Shield, QrCode, Users, AlertTriangle, Car, Clock, CheckCircle, Eye, Search } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.45 }}
    className="stat-card">
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>{label}</p>
        <div style={{ fontSize: 36, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.025em', lineHeight: 1 }}>{value}</div>
      </div>
      <div style={{ width: 52, height: 52, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${color}10`, border: `1.5px solid ${color}20` }}>
        <Icon size={24} style={{ color }} />
      </div>
    </div>
  </motion.div>
);

export default function SecurityDashboard() {
  const { user } = useAuthStore();

  const expectedVisitors = [
    { name: 'Amit Sharma',        flat: 'A-204', expectedAt: '3:30 PM', host: 'Raj Kumar',   status: 'pending' },
    { name: 'Food Delivery — Swiggy', flat: 'B-102', expectedAt: '4:00 PM', host: 'Priya Singh', status: 'pending' },
    { name: 'Rajesh Electrician', flat: 'C-301', expectedAt: '5:00 PM', host: 'Mr. Verma',   status: 'approved' },
    { name: 'Dr. Meena Gupta',    flat: 'A-105', expectedAt: '6:00 PM', host: 'Mrs. Agarwal',status: 'approved' },
  ];

  const recentEntries = [
    { name: 'Courier — Amazon',     flat: 'D-203', type: 'entry', time: '2:45 PM', guard: user?.firstName },
    { name: 'Suresh Plumber',       flat: 'A-101', type: 'exit',  time: '1:30 PM', guard: user?.firstName },
    { name: 'Guest — Kapoor Family',flat: 'B-205', type: 'entry', time: '12:00 PM', guard: user?.firstName },
  ];

  return (
    <div className="flex flex-col gap-8 animate-fade-in">

      {
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="welcome-banner"
        style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e40af 100%)', boxShadow: '0 16px 48px rgba(37,99,235,0.3)' }}>
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', top: -80, right: -60, background: 'radial-gradient(circle, rgba(255,255,255,0.07), transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative' }}>
          <div className="welcome-banner-inner" style={{ marginBottom: 24 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <Shield size={14} style={{ color: 'rgba(255,255,255,0.6)' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.65)', background: 'rgba(255,255,255,0.12)', padding: '4px 14px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.18)' }}>
                  Security Dashboard
                </span>
              </div>
              <h2 className="welcome-banner-title">{user?.firstName} {user?.lastName}</h2>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>Gate management &amp; visitor control</p>
            </div>
            <div className="hidden sm:block" style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Current Shift</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#ffffff' }}>Morning</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>6 AM – 2 PM</div>
            </div>
          </div>

          {
          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} id="sos-alert-btn"
            style={{ width: '100%', padding: '18px 24px', borderRadius: 16, background: 'linear-gradient(135deg, #dc2626, #b91c1c)', border: 'none', color: 'white', fontWeight: 800, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 8px 28px rgba(220,38,38,0.4)', letterSpacing: '-0.01em' }}>
            <AlertTriangle size={20} />
            EMERGENCY SOS — Alert Committee & All Residents
          </motion.button>
        </div>
      </motion.div>

      {
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <StatCard icon={Users}        label="Visitors Today" value="12" color="#4f46e5" delay={0.08} />
        <StatCard icon={CheckCircle}  label="Entries"        value="9"  color="#16a34a" delay={0.14} />
        <StatCard icon={Car}          label="Exits"          value="6"  color="#2563eb" delay={0.20} />
        <StatCard icon={AlertTriangle}label="Incidents"      value="0"  color="#dc2626" delay={0.26} />
      </div>

      {
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">

        {
        <div style={{ background: '#ffffff', border: '1px solid #e8ecf4', borderRadius: 24, padding: '48px 40px', textAlign: 'center', boxShadow: '0 2px 16px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eef2ff', border: '2px solid #c7d2fe', marginBottom: 24 }}>
            <QrCode size={36} style={{ color: '#6366f1' }} />
          </div>
          <h3 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.015em', marginBottom: 10 }}>Scan Visitor QR</h3>
          <p style={{ fontSize: 15, color: '#9ca3af', marginBottom: 32, maxWidth: 280, lineHeight: 1.6 }}>
            Scan a visitor's QR pass from their phone to verify and grant instant entry
          </p>
          <button id="scan-qr-btn" className="btn btn-primary btn-lg" style={{ width: '100%', maxWidth: 280, marginBottom: 24 }}>
            <QrCode size={18} /> Open Scanner
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', maxWidth: 280, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: '#e8ecf4' }} />
            <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: '#e8ecf4' }} />
          </div>
          <div style={{ position: 'relative', width: '100%', maxWidth: 280 }}>
            <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input className="input" style={{ paddingLeft: 42, textAlign: 'left', background: '#f4f6fb', fontSize: 14 }}
              placeholder="Search by name, phone or flat #..." />
          </div>
        </div>

        {
        <div style={{ background: '#ffffff', border: '1px solid #e8ecf4', borderRadius: 24, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}>
          <div style={{ padding: '24px 28px', borderBottom: '1px solid #f4f6fb', background: '#fafbff', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Eye size={17} style={{ color: '#2563eb' }} />
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>Expected Visitors</h3>
          </div>
          <div style={{ maxHeight: 420, overflowY: 'auto' }}>
            {expectedVisitors.map((v, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 * i }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 28px', borderBottom: i < expectedVisitors.length - 1 ? '1px solid #f4f6fb' : 'none', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fafbff'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: '#0f172a', marginBottom: 5 }}>{v.name}</div>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>
                    <span style={{ fontWeight: 700, color: '#374151' }}>{v.flat}</span> • Host: {v.host}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#9ca3af', fontWeight: 600, marginBottom: 8, justifyContent: 'flex-end' }}>
                    <Clock size={12} /> {v.expectedAt}
                  </div>
                  <span style={{
                    fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 99,
                    color: v.status === 'approved' ? '#15803d' : '#b45309',
                    background: v.status === 'approved' ? '#f0fdf4' : '#fffbeb',
                    border: `1px solid ${v.status === 'approved' ? '#bbf7d0' : '#fde68a'}`,
                    textTransform: 'capitalize'
                  }}>
                    {v.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {
      <div>
        <h3 style={{ fontSize: 11.5, fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>Recent Entry / Exit Log</h3>
        <div style={{ background: '#ffffff', border: '1px solid #e8ecf4', borderRadius: 24, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fafbff' }}>
                {['Name', 'Flat', 'Type', 'Time', 'Guard'].map((h) => (
                  <th key={h} style={{ padding: '16px 24px', textAlign: 'left', fontSize: 11.5, fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', borderBottom: '1px solid #e8ecf4' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentEntries.map((entry, i) => (
                <tr key={i} style={{ borderBottom: i < recentEntries.length - 1 ? '1px solid #f4f6fb' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fafbff'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '18px 24px', fontSize: 14.5, fontWeight: 700, color: '#0f172a' }}>{entry.name}</td>
                  <td style={{ padding: '18px 24px', fontSize: 14, color: '#6b7280' }}>{entry.flat}</td>
                  <td style={{ padding: '18px 24px' }}>
                    <span style={{
                      fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 99,
                      color: entry.type === 'entry' ? '#15803d' : '#1d4ed8',
                      background: entry.type === 'entry' ? '#f0fdf4' : '#eff6ff',
                      border: `1px solid ${entry.type === 'entry' ? '#bbf7d0' : '#bfdbfe'}`
                    }}>
                      {entry.type === 'entry' ? '↓ Entry' : '↑ Exit'}
                    </span>
                  </td>
                  <td style={{ padding: '18px 24px', fontSize: 14, color: '#6b7280' }}>{entry.time}</td>
                  <td style={{ padding: '18px 24px', fontSize: 14, color: '#6b7280' }}>{entry.guard}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
