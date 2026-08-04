import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { ShoppingBag, FileText, CheckCircle, Clock, Star, DollarSign, Store, Building2, ArrowUpRight } from 'lucide-react';

export default function VendorDashboard() {
  const { user } = useAuthStore();

  const serviceRequests = [
    { id: 'SR-012', title: 'Pest control — Basement area',    society: 'Green Valley', date: 'Jul 28, 2026', budget: '₹3,500', status: 'pending' },
    { id: 'SR-011', title: 'Garden landscaping',              society: 'Green Valley', date: 'Jul 29, 2026', budget: '₹8,000', status: 'accepted' },
    { id: 'SR-009', title: 'Deep cleaning — Common areas',    society: 'Green Valley', date: 'Jul 25, 2026', budget: '₹5,000', status: 'completed' },
  ];

  const STATUS_STYLES = {
    pending:   { color: '#d97706', bg: '#fffbeb', border: '#fde68a', label: 'Pending Review' },
    accepted:  { color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe', label: 'Accepted' },
    completed: { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', label: 'Completed' },
  };

  const headerStats = [
    { label: 'Active Jobs', value: '2',    icon: Clock,        color: '#ffffff' },
    { label: 'Completed',   value: '18',   icon: CheckCircle,  color: '#ffffff' },
    { label: 'Rating',      value: '4.8',  icon: Star,         color: '#fbbf24', fill: true },
    { label: 'Earnings',    value: '₹42K', icon: DollarSign,   color: '#ffffff' },
  ];

  return (
    <div className="flex flex-col gap-8 animate-fade-in">

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="welcome-banner"
        style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 50%, #10b981 100%)', boxShadow: '0 16px 48px rgba(5,150,105,0.3)' }}>
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', top: -80, right: -60, background: 'radial-gradient(circle, rgba(255,255,255,0.07), transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative' }}>
          <div className="welcome-banner-inner" style={{ marginBottom: 24 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <Store size={14} style={{ color: 'rgba(255,255,255,0.65)' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.15)', padding: '4px 14px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.2)' }}>
                  Vendor Partner
                </span>
              </div>
              <h2 className="welcome-banner-title">{user?.firstName} {user?.lastName}</h2>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>Service provider for Smart Society Hub</p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {headerStats.map((s) => (
              <div key={s.label}
                style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 16, padding: '16px', textAlign: 'center', backdropFilter: 'blur(8px)', transition: 'all 0.2s ease' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}>
                <s.icon size={20} style={{ color: s.color, fill: s.fill ? s.color : 'none', margin: '0 auto 10px' }} />
                <div style={{ fontSize: 22, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.025em', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontSize: 11.5, fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Service Requests</h3>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#1d4ed8', background: '#eff6ff', padding: '4px 12px', borderRadius: 99, border: '1px solid #bfdbfe' }}>
            {serviceRequests.length} requests
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {serviceRequests.map((sr, i) => {
            const style = STATUS_STYLES[sr.status];
            return (
              <motion.div key={sr.id}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * i, duration: 0.4 }}
                style={{ background: '#ffffff', border: '1.5px solid #e8ecf4', borderRadius: 24, padding: '28px 32px', boxShadow: '0 2px 16px rgba(0,0,0,0.04)', transition: 'all 0.25s ease' }}
                whileHover={{ y: -2, boxShadow: '0 8px 28px rgba(0,0,0,0.08)', borderColor: '#c7d2fe' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <span style={{ fontSize: 12.5, fontFamily: 'monospace', fontWeight: 700, color: '#9ca3af' }}>#{sr.id}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 99, color: style.color, background: style.bg, border: `1px solid ${style.border}` }}>
                        {style.label}
                      </span>
                    </div>
                    <h4 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em', marginBottom: 16, lineHeight: 1.3 }}>{sr.title}</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#374151', background: '#f4f6fb', padding: '5px 12px', borderRadius: 8, border: '1px solid #e8ecf4' }}>
                        <Building2 size={12} style={{ color: '#9ca3af' }} /> {sr.society}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#9ca3af', fontWeight: 500 }}>
                        <Clock size={12} /> {sr.date}
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 800, color: '#059669', background: '#f0fdf4', padding: '5px 14px', borderRadius: 8, border: '1px solid #bbf7d0' }}>
                        {sr.budget}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
                    {sr.status === 'pending' && (
                      <>
                        <button className="btn btn-ghost btn-md" style={{ color: '#dc2626', borderColor: '#fecaca' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          Decline
                        </button>
                        <button className="btn btn-primary btn-md">Accept Job</button>
                      </>
                    )}
                    {sr.status === 'accepted' && (
                      <>
                        <button className="btn btn-secondary btn-md" style={{ gap: 7 }}>
                          <FileText size={15} /> Upload Bill
                        </button>
                        <button className="btn btn-md" style={{ background: '#059669', color: 'white', gap: 7 }}
                          onMouseEnter={e => e.currentTarget.style.background = '#047857'}
                          onMouseLeave={e => e.currentTarget.style.background = '#059669'}>
                          <CheckCircle size={15} /> Mark Done
                        </button>
                      </>
                    )}
                    {sr.status === 'completed' && (
                      <button className="btn btn-ghost btn-md" style={{ gap: 6 }}>
                        View Details <ArrowUpRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
