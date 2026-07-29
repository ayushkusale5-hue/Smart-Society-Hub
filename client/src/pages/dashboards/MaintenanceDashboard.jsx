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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }} className="animate-fade-in">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{ padding: '40px 44px', borderRadius: 28, position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #d97706 0%, #b45309 50%, #ea580c 100%)', boxShadow: '0 16px 48px rgba(217,119,6,0.3)' }}>
        <div style={{ position: 'absolute', width: 350, height: 350, borderRadius: '50%', top: -80, right: -60, background: 'radial-gradient(circle, rgba(255,255,255,0.07), transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <Hammer size={16} style={{ color: 'rgba(255,255,255,0.65)' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.15)', padding: '4px 14px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.2)' }}>
              Maintenance Staff
            </span>
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 8 }}>
            {user?.firstName} {user?.lastName}
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', marginBottom: 32 }}>Maintenance task management & complaint resolution</p>

          {/* Quick stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl">
            {[
              { label: 'Assigned',        value: '4', icon: ListTodo },
              { label: 'In Progress',     value: '2', icon: Clock },
              { label: 'Completed Today', value: '3', icon: CheckCircle },
            ].map((s) => (
              <div key={s.label}
                style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 16, padding: '16px 20px', backdropFilter: 'blur(8px)' }}>
                <div style={{ width: 42, height: 42, borderRadius: 13, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <s.icon size={20} className="text-white" />
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: '#ffffff', lineHeight: 1, letterSpacing: '-0.025em' }}>{s.value}</div>
                  <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.6)', marginTop: 4, fontWeight: 600 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Task List ──────────────────────────────────────────────── */}
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
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>

                {/* Left: icon + info */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flex: 1 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: `${PRIORITY_COLORS[task.priority]}10`, border: `1.5px solid ${PRIORITY_COLORS[task.priority]}20` }}>
                    <AlertTriangle size={24} style={{ color: PRIORITY_COLORS[task.priority] }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 12.5, fontFamily: 'monospace', fontWeight: 700, color: '#9ca3af' }}>#{task.id}</span>
                      <span style={{
                        fontSize: 11.5, fontWeight: 700, padding: '3px 10px', borderRadius: 99, textTransform: 'capitalize',
                        color: PRIORITY_COLORS[task.priority], background: `${PRIORITY_COLORS[task.priority]}10`,
                        border: `1px solid ${PRIORITY_COLORS[task.priority]}25`
                      }}>{task.priority}</span>
                    </div>
                    <h4 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em', marginBottom: 14, lineHeight: 1.3 }}>{task.title}</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#374151', background: '#f4f6fb', padding: '5px 12px', borderRadius: 8, border: '1px solid #e8ecf4' }}>
                        <Home size={12} style={{ color: '#9ca3af' }} /> {task.flat}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#374151', background: '#f4f6fb', padding: '5px 12px', borderRadius: 8, border: '1px solid #e8ecf4' }}>
                        <FolderOpen size={12} style={{ color: '#9ca3af' }} /> {task.category}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#9ca3af', fontWeight: 500 }}>
                        <Clock size={12} /> {task.assignedAt}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: status + actions */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 16, flexShrink: 0 }}>
                  <span style={{
                    fontSize: 12.5, fontWeight: 700, padding: '6px 14px', borderRadius: 99, textTransform: 'capitalize',
                    color: STATUS_COLORS[task.status], background: STATUS_BG[task.status],
                    border: `1px solid ${STATUS_COLORS[task.status]}25`
                  }}>
                    {task.status.replace('_', ' ')}
                  </span>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {task.status === 'open' && (
                      <button className="btn btn-secondary btn-sm">Start Work</button>
                    )}
                    {task.status === 'in_progress' && (
                      <>
                        <button className="btn btn-ghost btn-sm" style={{ gap: 6 }}>
                          <Camera size={14} /> Photo
                        </button>
                        <button className="btn btn-primary btn-sm" style={{ gap: 6 }}>
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
