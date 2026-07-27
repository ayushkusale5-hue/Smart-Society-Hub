import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { ShoppingBag, FileText, CheckCircle, Clock, Star, DollarSign, Store } from 'lucide-react';

export default function VendorDashboard() {
  const { user } = useAuthStore();

  const serviceRequests = [
    { id: 'SR-012', title: 'Pest control — Basement area', society: 'Green Valley', date: 'Jul 28, 2026', budget: '₹3,500', status: 'pending' },
    { id: 'SR-011', title: 'Garden landscaping', society: 'Green Valley', date: 'Jul 29, 2026', budget: '₹8,000', status: 'accepted' },
    { id: 'SR-009', title: 'Deep cleaning — Common areas', society: 'Green Valley', date: 'Jul 25, 2026', budget: '₹5,000', status: 'completed' },
  ];

  const STATUS_STYLES = {
    pending: { color: '#d97706', label: 'Pending Review' },
    accepted: { color: '#6366f1', label: 'Accepted' },
    completed: { color: '#16a34a', label: 'Completed' },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}>
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, white, transparent)' }} />
          
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Store size={16} className="text-emerald-100" />
            <span className="badge bg-white/20 text-white border-white/30">Vendor Partner</span>
          </div>
          <h2 className="text-2xl font-bold text-white">{user?.firstName} {user?.lastName}</h2>
          <p className="text-emerald-100 text-sm mt-1">Service provider for Smart Society Hub</p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {[
              { label: 'Active Jobs', value: '2', icon: Clock },
              { label: 'Completed', value: '18', icon: CheckCircle },
              { label: 'Rating', value: '4.8★', icon: Star },
              { label: 'Earnings', value: '₹42K', icon: DollarSign },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-sm text-center transition-all hover:bg-white/15">
                <s.icon size={20} className="mx-auto mb-2 text-white opacity-80" />
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-emerald-100 font-medium uppercase tracking-wide mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Service requests */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Service Requests</h3>
          <span className="badge badge-info">{serviceRequests.length} requests</span>
        </div>
        
        <div className="space-y-4">
          {serviceRequests.map((sr, i) => {
            const style = STATUS_STYLES[sr.status];
            return (
              <motion.div key={sr.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
                className="card p-5 group hover:border-indigo-200 cursor-default">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono font-semibold" style={{ color: 'var(--color-text-muted)' }}>#{sr.id}</span>
                      <span className="badge" style={{
                        background: `${style.color}10`,
                        color: style.color,
                        border: `1px solid ${style.color}25`,
                      }}>{style.label}</span>
                    </div>
                    
                    <h4 className="font-bold text-base mb-2" style={{ color: 'var(--color-text-primary)' }}>{sr.title}</h4>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                      <span className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md">
                        🏢 {sr.society}
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Clock size={12} /> {sr.date}
                      </span>
                      <span className="font-bold text-emerald-600 ml-auto md:ml-0 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                        {sr.budget}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 md:pl-4 mt-2 md:mt-0 w-full md:w-auto justify-end">
                    {sr.status === 'pending' && (
                      <>
                        <button className="btn btn-ghost text-red-600 hover:bg-red-50 hover:border-red-200 hover:text-red-700 btn-sm flex-1 md:flex-initial">Decline</button>
                        <button className="btn btn-primary btn-sm flex-1 md:flex-initial">Accept Job</button>
                      </>
                    )}
                    {sr.status === 'accepted' && (
                      <>
                        <button className="btn btn-secondary btn-sm flex-1 md:flex-initial gap-1.5">
                          <FileText size={14} /> Upload Bill
                        </button>
                        <button className="btn bg-emerald-600 hover:bg-emerald-700 text-white btn-sm flex-1 md:flex-initial gap-1.5">
                          <CheckCircle size={14} /> Mark Done
                        </button>
                      </>
                    )}
                    {sr.status === 'completed' && (
                      <button className="btn btn-ghost btn-sm w-full md:w-auto">View Details</button>
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
