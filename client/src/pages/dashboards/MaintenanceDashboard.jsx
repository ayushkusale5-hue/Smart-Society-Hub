import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { Wrench, CheckCircle, Clock, Camera, AlertTriangle, ListTodo, Hammer, Home, FolderOpen, ChevronRight } from 'lucide-react';

const PRIORITY_COLORS = { high: '#dc2626', medium: '#d97706', low: '#16a34a', urgent: '#ea580c' };
const STATUS_COLORS   = { open: '#6366f1', in_progress: '#d97706', resolved: '#16a34a', pending: '#2563eb' };
const STATUS_BG       = { open: '#eef2ff', in_progress: '#fffbeb', resolved: '#f0fdf4', pending: '#eff6ff' };

export default function MaintenanceDashboard() {
  const { user } = useAuthStore();

  const tasks = [
    { id: 'C-034', title: 'Leaking pipe in bathroom',       flat: 'A-204',  category: 'Plumbing',   priority: 'high',   status: 'in_progress', assignedAt: '2h ago' },
    { id: 'C-037', title: 'Electrical short circuit',       flat: 'B-105',  category: 'Electrical', priority: 'urgent', status: 'open',        assignedAt: '4h ago' },
    { id: 'C-029', title: 'Broken window latch',            flat: 'C-302',  category: 'Civil',      priority: 'low',    status: 'open',        assignedAt: '1d ago' },
    { id: 'C-031', title: 'Common area light not working',  flat: 'Common', category: 'Electrical', priority: 'medium', status: 'in_progress', assignedAt: '2d ago' },
  ];

  return (
    <div className="flex flex-col gap-8 animate-fade-in">

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="welcome-banner"
        style={{ background: 'linear-gradient(135deg, #d97706 0%, #b45309 50%, #ea580c 100%)', boxShadow: '0 16px 48px rgba(217,119,6,0.3)' }}>
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', top: -80, right: -60, background: 'radial-gradient(circle, rgba(255,255,255,0.07), transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <Hammer size={14} style={{ color: 'rgba(255,255,255,0.65)' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.15)', padding: '4px 14px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.2)' }}>
              Maintenance Staff
            </span>
          </div>
          <h2 className="welcome-banner-title">{user?.firstName} {user?.lastName}</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 24 }}>Maintenance task management &amp; complaint resolution</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg">
            {[
              { label: 'Assigned',        value: '4', icon: ListTodo },
              { label: 'In Progress',     value: '2', icon: Clock },
              { label: 'Completed Today', value: '3', icon: CheckCircle },
            ].map((s) => (
              <div key={s.label}
                className={s.label === 'Completed Today' ? 'col-span-2 sm:col-span-1' : ''}
                style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 14, padding: '12px 16px', backdropFilter: 'blur(8px)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 11, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <s.icon size={16} className="text-white" />
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#ffffff', lineHeight: 1, letterSpacing: '-0.025em' }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 3, fontWeight: 600 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontSize: 11.5, fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' }}>My Assigned Tasks</h3>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#b45309', background: '#fffbeb', padding: '4px 12px', borderRadius: 99, border: '1px solid #fde68a' }}>
            {tasks.length} active
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {tasks.map((task, i) => (
            <motion.div key={task.id}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * i, duration: 0.4 }}
              style={{ background: '#ffffff', border: '1.5px solid #e8ecf4', borderRadius: 24, padding: '28px 32px', boxShadow: '0 2px 16px rgba(0,0,0,0.04)', transition: 'all 0.25s ease', cursor: 'pointer' }}
              whileHover={{ borderColor: PRIORITY_COLORS[task.priority] + '35', y: -2, boxShadow: `0 8px 28px ${PRIORITY_COLORS[task.priority]}10` }}>
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">

                <div className="flex items-start gap-4 sm:gap-5 flex-1">
                  <div style={{ width: 56, height: 56, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: `${PRIORITY_COLORS[task.priority]}10`, border: `1.5px solid ${PRIORITY_COLORS[task.priority]}20` }}>
                    <AlertTriangle size={24} style={{ color: PRIORITY_COLORS[task.priority] }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-mono font-bold text-slate-400">#{task.id}</span>
                      <span style={{
                        fontSize: 11.5, fontWeight: 700, padding: '3px 10px', borderRadius: 99, textTransform: 'capitalize',
                        color: PRIORITY_COLORS[task.priority], background: `${PRIORITY_COLORS[task.priority]}10`,
                        border: `1px solid ${PRIORITY_COLORS[task.priority]}25`
                      }}>{task.priority}</span>
                    </div>
                    <h4 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight mb-3 leading-snug">{task.title}</h4>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                        <Home size={12} className="text-slate-400" /> {task.flat}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                        <FolderOpen size={12} className="text-slate-400" /> {task.category}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-400 font-medium ml-1 mt-1 sm:mt-0">
                        <Clock size={12} /> {task.assignedAt}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-4 flex-shrink-0 w-full lg:w-auto pt-4 lg:pt-0 border-t border-slate-100 lg:border-0">
                  <span style={{
                    fontSize: 12.5, fontWeight: 700, padding: '6px 14px', borderRadius: 99, textTransform: 'capitalize',
                    color: STATUS_COLORS[task.status], background: STATUS_BG[task.status],
                    border: `1px solid ${STATUS_COLORS[task.status]}25`
                  }}>
                    {task.status.replace('_', ' ')}
                  </span>
                  <div className="flex gap-2">
                    {task.status === 'open' && (
                      <button className="btn btn-secondary btn-sm whitespace-nowrap">Start Work</button>
                    )}
                    {task.status === 'in_progress' && (
                      <>
                        <button className="btn btn-ghost btn-sm gap-1.5 whitespace-nowrap">
                          <Camera size={14} /> <span className="hidden sm:inline">Photo</span>
                        </button>
                        <button className="btn btn-primary btn-sm gap-1.5 whitespace-nowrap">
                          <CheckCircle size={14} /> Mark Done
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
