import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { Shield, QrCode, Users, AlertTriangle, Car, Clock, CheckCircle, Eye } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className="stat-card">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
        <div className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{value}</div>
      </div>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ background: `${color}10`, border: `1px solid ${color}20` }}>
        <Icon size={22} style={{ color }} />
      </div>
    </div>
  </motion.div>
);

export default function SecurityDashboard() {
  const { user } = useAuthStore();

  const expectedVisitors = [
    { name: 'Amit Sharma', flat: 'A-204', expectedAt: '3:30 PM', host: 'Raj Kumar', status: 'pending' },
    { name: 'Food Delivery — Swiggy', flat: 'B-102', expectedAt: '4:00 PM', host: 'Priya Singh', status: 'pending' },
    { name: 'Rajesh Electrician', flat: 'C-301', expectedAt: '5:00 PM', host: 'Mr. Verma', status: 'approved' },
    { name: 'Dr. Meena Gupta', flat: 'A-105', expectedAt: '6:00 PM', host: 'Mrs. Agarwal', status: 'approved' },
  ];

  const recentEntries = [
    { name: 'Courier — Amazon', flat: 'D-203', type: 'entry', time: '2:45 PM', guard: user?.firstName },
    { name: 'Suresh Plumber', flat: 'A-101', type: 'exit', time: '1:30 PM', guard: user?.firstName },
    { name: 'Guest — Kapoor Family', flat: 'B-205', type: 'entry', time: '12:00 PM', guard: user?.firstName },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #2563eb, #1e40af)' }}>
        <div className="absolute -left-8 -bottom-8 w-40 h-40 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, white, transparent)' }} />
        
        <div className="relative flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield size={16} className="text-blue-100" />
              <span className="badge bg-white/20 text-white border-white/30">Security Dashboard</span>
            </div>
            <h2 className="text-2xl font-bold text-white">{user?.firstName} {user?.lastName}</h2>
            <p className="text-blue-100 text-sm mt-1">Gate management & visitor control</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-200">Shift</div>
            <div className="text-white font-bold text-lg">Morning</div>
            <div className="text-blue-200 text-xs mt-0.5">6 AM – 2 PM</div>
          </div>
        </div>

        {/* SOS Button */}
        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} id="sos-alert-btn"
          className="relative mt-6 btn bg-red-600 hover:bg-red-700 text-white border-none btn-lg w-full shadow-lg overflow-hidden group">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          <AlertTriangle size={18} /> EMERGENCY SOS — Alert Committee & Residents
        </motion.button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <StatCard icon={Users} label="Visitors Today" value="12" color="#4f46e5" delay={0.1} />
        <StatCard icon={CheckCircle} label="Entries" value="9" color="#16a34a" delay={0.15} />
        <StatCard icon={Car} label="Exits" value="6" color="#2563eb" delay={0.2} />
        <StatCard icon={AlertTriangle} label="Incidents" value="0" color="#dc2626" delay={0.25} />
      </div>

      {/* QR Scanner + Expected visitors */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* QR Scan */}
        <div className="card text-center flex flex-col justify-center py-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-indigo-50 border border-indigo-100">
            <QrCode size={32} className="text-indigo-600" />
          </div>
          <h3 className="font-bold text-xl mb-2" style={{ color: 'var(--color-text-primary)' }}>Scan Visitor QR</h3>
          <p className="text-sm mb-6 max-w-xs mx-auto" style={{ color: 'var(--color-text-muted)' }}>
            Scan a visitor's QR pass from their phone to verify and grant instant entry
          </p>
          <button id="scan-qr-btn" className="btn btn-primary btn-lg max-w-xs mx-auto w-full">
            <QrCode size={18} /> Open Scanner
          </button>
          
          <div className="relative my-6 max-w-sm mx-auto w-full">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <div className="relative flex justify-center"><span className="bg-white px-3 text-xs font-medium text-gray-400">OR</span></div>
          </div>
          
          <div className="max-w-sm mx-auto w-full">
            <input className="input text-sm text-center bg-gray-50" placeholder="Search by name, phone or flat #..." />
          </div>
        </div>

        {/* Expected visitors */}
        <div className="card p-0 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
              <Eye size={16} className="text-blue-600" />
              Expected Visitors
            </h3>
          </div>
          <div className="divide-y divide-gray-100 flex-1 overflow-y-auto" style={{ maxHeight: '400px' }}>
            {expectedVisitors.map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                <div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{v.name}</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                    <span className="font-medium text-slate-700">{v.flat}</span> • Host: {v.host}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5 text-xs mb-1.5 font-medium" style={{ color: 'var(--color-text-muted)' }}>
                    <Clock size={12} /> {v.expectedAt}
                  </div>
                  <span className={`badge ${v.status === 'approved' ? 'badge-success' : 'badge-warning'}`}>
                    {v.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent entries */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-muted)' }}>Recent Entry/Exit Log</h3>
        <div className="card p-0 overflow-hidden">
          <div className="table-container border-0 rounded-none">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Flat</th>
                  <th>Type</th>
                  <th>Time</th>
                  <th>Guard</th>
                </tr>
              </thead>
              <tbody>
                {recentEntries.map((entry, i) => (
                  <tr key={i}>
                    <td className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{entry.name}</td>
                    <td style={{ color: 'var(--color-text-secondary)' }}>{entry.flat}</td>
                    <td>
                      <span className={`badge ${entry.type === 'entry' ? 'badge-success' : 'badge-info'}`}>
                        {entry.type === 'entry' ? '↓ Entry' : '↑ Exit'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--color-text-secondary)' }}>{entry.time}</td>
                    <td style={{ color: 'var(--color-text-secondary)' }}>{entry.guard}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
