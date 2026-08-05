import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, Shield, Flame, Heart, CloudLightning, HelpCircle, CheckCircle, Clock, X, PhoneCall, ArrowRight } from 'lucide-react';
import { sosService } from '../../services/sos.service';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const SOS_TYPES = [
  { value: 'Medical', icon: Heart, color: '#ef4444', gradient: 'from-red-500 to-rose-600', shadow: 'rgba(239, 68, 68, 0.4)' },
  { value: 'Fire', icon: Flame, color: '#f97316', gradient: 'from-orange-500 to-amber-600', shadow: 'rgba(249, 115, 22, 0.4)' },
  { value: 'Security', icon: Shield, color: '#3b82f6', gradient: 'from-blue-500 to-indigo-600', shadow: 'rgba(59, 130, 246, 0.4)' },
  { value: 'Disaster', icon: CloudLightning, color: '#8b5cf6', gradient: 'from-violet-500 to-purple-600', shadow: 'rgba(139, 92, 246, 0.4)' },
  { value: 'Other', icon: HelpCircle, color: '#64748b', gradient: 'from-slate-500 to-gray-600', shadow: 'rgba(100, 116, 139, 0.4)' },
];

const STATUS_STYLE = {
  Active: { color: '#ef4444', bg: '#fef2f2', border: '#fecaca', badge: 'bg-red-500' },
  Acknowledged: { color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', badge: 'bg-amber-500' },
  Resolved: { color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0', badge: 'bg-green-500' },
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
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['sos-alerts'] }); 
      toast.success('SOS Alert sent successfully!', { icon: '🚨' }); 
      setShowConfirm(false); 
      setMessage(''); 
    },
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

  const activeType = SOS_TYPES.find(t => t.value === selectedType) || SOS_TYPES[0];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <span className="bg-red-100 text-red-600 p-2 rounded-xl">
              <AlertTriangle size={28} />
            </span>
            Emergency SOS
          </h1>
          <p className="text-slate-500 text-base mt-2">Trigger immediate emergency alerts to security and response teams.</p>
        </div>
      </div>

      {/* SOS Trigger Section - Highly animated and premium */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2.5rem] p-8 md:p-10 shadow-2xl"
        style={{
          background: 'linear-gradient(145deg, #1e293b, #0f172a)',
          boxShadow: `0 25px 50px -12px ${activeType.shadow}`
        }}
      >
        {/* Animated Background Elements */}
        <div className="absolute top-[-50%] left-[-10%] w-[120%] h-[200%] opacity-20 pointer-events-none"
             style={{ background: `radial-gradient(circle, ${activeType.color} 0%, transparent 50%)`, animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
          
          {/* Big pulsing SOS button on the left */}
          <div className="flex-shrink-0 relative group">
            <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: activeType.color, animationDuration: '2s' }} />
            <div className="absolute inset-[-20px] rounded-full opacity-30 blur-2xl transition-all duration-500" style={{ background: activeType.color }} />
            <button 
              onClick={() => setShowConfirm(true)}
              className="relative w-48 h-48 md:w-56 md:h-56 rounded-full flex flex-col items-center justify-center gap-3 text-white transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${activeType.color}, #000000)`,
                boxShadow: `inset 0 4px 20px rgba(255,255,255,0.3), 0 10px 40px ${activeType.shadow}`,
                border: `4px solid ${activeType.color}80`
              }}
            >
              <PhoneCall size={48} className="animate-bounce" style={{ animationDuration: '2s' }} />
              <span className="text-3xl font-black tracking-widest text-shadow-sm">SOS</span>
              <span className="text-xs uppercase tracking-[0.2em] opacity-80 font-semibold">{activeType.value}</span>
            </button>
          </div>

          {/* Form and Selection on the right */}
          <div className="flex-1 w-full space-y-6">
            <div>
              <h3 className="text-white font-bold text-xl mb-4">Select Emergency Type</h3>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {SOS_TYPES.map(t => (
                  <button 
                    key={t.value} 
                    onClick={() => setSelectedType(t.value)}
                    className="relative flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 group cursor-pointer"
                    style={{
                      background: selectedType === t.value ? t.color : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${selectedType === t.value ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'}`,
                    }}
                  >
                    <t.icon size={24} className={`mb-2 ${selectedType === t.value ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${selectedType === t.value ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                      {t.value}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-semibold text-sm mb-2 block">Additional Details (Optional)</label>
              <textarea 
                value={message} 
                onChange={e => setMessage(e.target.value)} 
                rows={2}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-5 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all resize-none"
                style={{ focusRing: activeType.color }}
                placeholder={`Describe the ${activeType.value.toLowerCase()} emergency...`} 
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Confirmation Modal - Glassmorphism */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowConfirm(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-white rounded-[2rem] overflow-hidden shadow-2xl border border-white/20" 
              onClick={e => e.stopPropagation()}
            >
              <div className="p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(to right, ${activeType.color}, transparent)` }} />
                
                <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center relative">
                  <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: activeType.color }} />
                  <div className="relative w-full h-full rounded-full flex items-center justify-center shadow-lg" style={{ background: activeType.color }}>
                    <activeType.icon size={40} className="text-white" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Trigger {activeType.value} Alert?</h3>
                <p className="text-slate-500 text-base mb-8">This will immediately alert all active security, committee members, and maintenance staff.</p>
                
                <div className="flex gap-4">
                  <button onClick={() => setShowConfirm(false)} className="flex-1 py-4 rounded-2xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                    Cancel
                  </button>
                  <button 
                    onClick={() => triggerMutation.mutate({ type: selectedType, message })}
                    className="flex-1 py-4 rounded-2xl font-bold text-white shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                    style={{ background: activeType.color, boxShadow: `0 10px 25px -5px ${activeType.shadow}` }}
                    disabled={triggerMutation.isPending}
                  >
                    {triggerMutation.isPending ? 'Sending...' : 'CONFIRM SOS'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Alerts List */}
      <div className="mt-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Recent Alerts
          </h2>
          <div className="flex p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/50">
            {['', 'Active', 'Acknowledged', 'Resolved'].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  filter === s ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-700'
                }`}>
                {s || 'All Status'}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-28 bg-slate-100 rounded-3xl animate-pulse" />)}</div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Safe & Secure</h3>
            <p className="text-slate-500 text-base">No active emergencies at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {alerts.map((alert, idx) => {
              const st = STATUS_STYLE[alert.status] || STATUS_STYLE.Active;
              const typeStyle = SOS_TYPES.find(t => t.value === alert.type) || SOS_TYPES[4];
              
              return (
                <motion.div 
                  key={alert._id} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex items-start md:items-center gap-5 flex-1 min-w-0">
                    <div className="relative">
                      {alert.status === 'Active' && <div className="absolute inset-0 rounded-2xl animate-ping opacity-20" style={{ background: typeStyle.color }} />}
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 relative shadow-inner" style={{ background: `${typeStyle.color}15` }}>
                        <typeStyle.icon size={26} style={{ color: typeStyle.color }} />
                      </div>
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-extrabold text-slate-900 text-lg">{alert.type} Emergency</h3>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-sm ${st.badge}`}>
                          {alert.status}
                        </span>
                      </div>
                      
                      <div className="text-sm font-medium text-slate-600 mb-1 flex items-center gap-2">
                        <span className="text-slate-900">{alert.triggeredByName}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="text-indigo-600">{alert.location || 'Location Unknown'}</span>
                      </div>
                      
                      {alert.message && (
                        <div className="text-sm text-slate-500 mb-2 truncate">"{alert.message}"</div>
                      )}
                      
                      <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                        <Clock size={12} /> {new Date(alert.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 flex-shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 w-full md:w-auto">
                    {isResponder && alert.status === 'Active' && (
                      <button 
                        onClick={() => acknowledgeMutation.mutate(alert._id)} 
                        className="flex-1 md:flex-none px-6 py-3 rounded-xl font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        Acknowledge
                      </button>
                    )}
                    {isResponder && alert.status === 'Acknowledged' && (
                      <button 
                        onClick={() => resolveMutation.mutate(alert._id)} 
                        className="flex-1 md:flex-none px-6 py-3 rounded-xl font-bold text-white bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        Mark Resolved <CheckCircle size={18} />
                      </button>
                    )}
                    {!isResponder && (
                      <div className="w-full text-center md:text-right text-sm font-semibold text-slate-400 py-2">
                        Response Teams Notified
                      </div>
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
