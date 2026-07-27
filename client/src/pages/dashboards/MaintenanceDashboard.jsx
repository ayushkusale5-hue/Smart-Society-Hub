import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { Wrench, CheckCircle, Clock, Camera, AlertTriangle, ListTodo, Hammer } from 'lucide-react';

const PRIORITY_COLORS = { high: '#dc2626', medium: '#d97706', low: '#16a34a', urgent: '#ea580c' };
const STATUS_COLORS = { open: '#6366f1', in_progress: '#d97706', resolved: '#16a34a', pending: '#2563eb' };

export default function MaintenanceDashboard() {
  const { user } = useAuthStore();

  const tasks = [
    { id: 'C-034', title: 'Leaking pipe in bathroom', flat: 'A-204', category: 'Plumbing', priority: 'high', status: 'in_progress', assignedAt: '2h ago' },
    { id: 'C-037', title: 'Electrical short circuit', flat: 'B-105', category: 'Electrical', priority: 'urgent', status: 'open', assignedAt: '4h ago' },
    { id: 'C-029', title: 'Broken window latch', flat: 'C-302', category: 'Civil', priority: 'low', status: 'open', assignedAt: '1d ago' },
    { id: 'C-031', title: 'Common area light not working', flat: 'Common', category: 'Electrical', priority: 'medium', status: 'in_progress', assignedAt: '2d ago' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #d97706, #ea580c)' }}>
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, white, transparent)' }} />
          
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Hammer size={16} className="text-amber-100" />
            <span className="badge bg-white/20 text-white border-white/30">Maintenance Staff</span>
          </div>
          <h2 className="text-2xl font-bold text-white">{user?.firstName} {user?.lastName}</h2>
          <p className="text-amber-100 text-sm mt-1">Maintenance task management & complaint resolution</p>

          {/* Quick stats row */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { label: 'Assigned', value: '4', icon: ListTodo },
              { label: 'In Progress', value: '2', icon: Clock },
              { label: 'Completed Today', value: '3', icon: CheckCircle },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-4 bg-white/10 border border-white/20 rounded-xl p-3 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <s.icon size={18} className="text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-amber-100 font-medium">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Task list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>My Assigned Tasks</h3>
          <span className="badge badge-warning">{tasks.length} active</span>
        </div>
        
        <div className="space-y-4">
          {tasks.map((task, i) => (
            <motion.div key={task.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
              className="card p-5 group cursor-pointer hover:border-indigo-200">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${PRIORITY_COLORS[task.priority]}15` }}>
                    <AlertTriangle size={20} style={{ color: PRIORITY_COLORS[task.priority] }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-mono font-semibold" style={{ color: 'var(--color-text-muted)' }}>#{task.id}</span>
                      <span className="badge" style={{
                        background: `${PRIORITY_COLORS[task.priority]}10`,
                        color: PRIORITY_COLORS[task.priority],
                        border: `1px solid ${PRIORITY_COLORS[task.priority]}25`
                      }}>{task.priority}</span>
                    </div>
                    <h4 className="font-bold text-base mb-2" style={{ color: 'var(--color-text-primary)' }}>{task.title}</h4>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                      <span className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md">
                        🏠 {task.flat}
                      </span>
                      <span className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md">
                        📁 {task.category}
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Clock size={12} /> {task.assignedAt}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end justify-between gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-4 mt-2 md:mt-0 w-full md:w-auto">
                  <span className="badge w-max" style={{
                    background: `${STATUS_COLORS[task.status]}10`,
                    color: STATUS_COLORS[task.status],
                    border: `1px solid ${STATUS_COLORS[task.status]}25`,
                  }}>
                    {task.status.replace('_', ' ')}
                  </span>
                  
                  <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
                    {task.status === 'open' && (
                      <button className="btn btn-secondary btn-sm w-full md:w-auto">Start Work</button>
                    )}
                    {task.status === 'in_progress' && (
                      <>
                        <button className="btn btn-ghost btn-sm gap-1 flex-1 md:flex-initial">
                          <Camera size={14} /> Photo
                        </button>
                        <button className="btn btn-primary btn-sm gap-1 flex-1 md:flex-initial">
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
