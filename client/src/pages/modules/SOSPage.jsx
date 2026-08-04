import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, Shield, Flame, Heart, CloudLightning, HelpCircle, CheckCircle, Clock, X } from 'lucide-react';
import { sosService } from '../../services/sos.service';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const SOS_TYPES = [
  { value: 'Medical', icon: Heart, color: '#dc2626', bg: '#fef2f2' },
  { value: 'Fire', icon: Flame, color: '#ea580c', bg: '#fff7ed' },
  { value: 'Security', icon: Shield, color: '#2563eb', bg: '#eff6ff' },
  { value: 'Natural Disaster', icon: CloudLightning, color: '#7c3aed', bg: '#f5f3ff' },
  { value: 'Other', icon: HelpCircle, color: '#6b7280', bg: '#f9fafb' },
];

const STATUS_STYLE = {
  Active: { color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
  Acknowledged: { color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  Resolved: { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
};

export default function SOSPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [selectedType, setSelectedType] = useState('Medical');
  const [message, setMessage] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [filter, setFilter] = useState('');
  const isResponder = ['security', 'committee'].includes(user?.role);

  const { data: alertsRes, isLoading } = useQuery({
    queryKey: ['sos-alerts', filter],
    queryFn: () => sosService.getAlerts(filter ? { status: filter } : {}),
  });
  const alerts = alertsRes?.data || [];

  const triggerMutation = useMutation({
    mutationFn: (data) => sosService.trigger(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['sos-alerts'] }); toast.success('🆘 SOS Alert sent!'); setShowConfirm(false); setMessage(''); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to send SOS'),
  });

  const acknowledgeMutation = useMutation({
    mutationFn: (id) => sosService.acknowledge(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['sos-alerts'] }); toast.success('Alert acknowledged'); },
  });

  const resolveMutation = useMutation({
    mutationFn: (id) => sosService.resolve(id, {}),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['sos-alerts'] }); toast.success('Alert resolved'); },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Emergency SOS</h1>
        <p className="text-slate-500 text-sm mt-1">Trigger emergency alerts for immediate assistance</p>
      </div>

      {/* SOS Trigger Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl border border-red-200/60 p-8">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <AlertTriangle size={20} className="text-red-500" /> Trigger SOS Alert
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {SOS_TYPES.map(t => (
            <button key={t.value} onClick={() => setSelectedType(t.value)}
              className="p-4 rounded-2xl border-2 transition-all text-center"
              style={{
                borderColor: selectedType === t.value ? t.color : '#e2e8f0',
                background: selectedType === t.value ? t.bg : '#fff',
              }}>
              <t.icon size={24} className="mx-auto mb-2" style={{ color: t.color }} />
              <div className="text-xs font-bold" style={{ color: t.color }}>{t.value}</div>
            </button>
          ))}
        </div>

        <textarea value={message} onChange={e => setMessage(e.target.value)} rows={2}
          className="input mb-4" placeholder="Optional: Describe the emergency..." />

        <button onClick={() => setShowConfirm(true)}
          className="w-full py-4 rounded-2xl font-bold text-white text-lg flex items-center justify-center gap-3"
          style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)', boxShadow: '0 8px 28px rgba(220,38,38,0.4)' }}>
          <AlertTriangle size={22} /> TRIGGER SOS ALERT
        </button>
      </motion.div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <div className="modal-backdrop" onClick={() => setShowConfirm(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="modal-content" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
              <div className="p-8 text-center">
                <div className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center"
                  style={{ background: '#fef2f2', border: '2px solid #fecaca' }}>
                  <AlertTriangle size={36} className="text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Confirm SOS Alert</h3>
                <p className="text-slate-500 text-sm mb-6">This will alert all security, committee, and maintenance staff immediately.</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowConfirm(false)} className="btn btn-ghost flex-1">Cancel</button>
                  <button onClick={() => triggerMutation.mutate({ type: selectedType, message })}
                    className="flex-1 py-3 rounded-xl font-bold text-white"
                    style={{ background: '#dc2626' }}
                    disabled={triggerMutation.isPending}>
                    {triggerMutation.isPending ? 'Sending...' : 'Send SOS'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Alerts List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Alert History</h2>
          <div className="flex flex-wrap items-center gap-2 bg-slate-100/80 p-1.5 rounded-2xl">
            {['', 'Active', 'Acknowledged', 'Resolved'].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === s ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                {s || 'All'}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 bg-slate-100/50 rounded-2xl animate-pulse" />)}</div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/60 shadow-sm">
            <CheckCircle size={40} className="mx-auto mb-3 text-green-400" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">No alerts</h3>
            <p className="text-slate-500 text-sm">Everything looks safe right now.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map(alert => {
              const st = STATUS_STYLE[alert.status] || STATUS_STYLE.Active;
              return (
                <motion.div key={alert._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: st.bg }}>
                      <AlertTriangle size={20} style={{ color: st.color }} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 text-sm">{alert.type} Emergency</div>
                      <div className="text-xs text-slate-500 truncate">{alert.triggeredByName} • {alert.location || 'No location'}</div>
                      {alert.message && <div className="text-xs text-slate-400 mt-1 truncate">{alert.message}</div>}
                      <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <Clock size={10} /> {new Date(alert.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ color: st.color, background: st.bg, border: `1px solid ${st.border}` }}>
                      {alert.status}
                    </span>
                    {isResponder && alert.status === 'Active' && (
                      <button onClick={() => acknowledgeMutation.mutate(alert._id)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }}>Acknowledge</button>
                    )}
                    {isResponder && alert.status === 'Acknowledged' && (
                      <button onClick={() => resolveMutation.mutate(alert._id)} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: 12 }}>Resolve</button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
