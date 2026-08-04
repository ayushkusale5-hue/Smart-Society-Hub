import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Wrench, MapPin, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { complaintService } from '../../services/complaint.service';
import toast from 'react-hot-toast';

const STATUS_STYLE = {
  Assigned: { color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  'In Progress': { color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
};

export default function MyTasksPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('');

  const { data: res, isLoading } = useQuery({
    queryKey: ['my-tasks'],
    queryFn: () => complaintService.getAll(),
  });
  
  // Maintenance gets tasks assigned to them (or we simulate with status filter for now)
  const tasks = (res?.data || []).filter(c => c.status === 'Assigned' || c.status === 'In Progress');

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => complaintService.update(id, { status }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['my-tasks'] }); toast.success('Task status updated'); },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Tasks</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your active maintenance assignments</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 bg-slate-100/80 p-1.5 rounded-2xl w-fit">
        {['', 'Assigned', 'In Progress'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${filter === s ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {s || 'All Active'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">{[1,2,3].map(i => <div key={i} className="h-48 bg-slate-100/50 rounded-2xl animate-pulse" />)}</div>
      ) : tasks.filter(t => filter ? t.status === filter : true).length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/60 shadow-sm">
          <CheckCircle size={40} className="mx-auto mb-3 text-indigo-300" />
          <h3 className="text-lg font-bold text-slate-900 mb-1">No active tasks</h3>
          <p className="text-slate-500 text-sm">You're all caught up! Take a break.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tasks.filter(t => filter ? t.status === filter : true).map((task, i) => {
            const st = STATUS_STYLE[task.status];
            return (
              <motion.div key={task._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ color: st.color, background: st.bg, border: `1px solid ${st.border}` }}>{task.status}</span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-600">{task.priority} Priority</span>
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{task.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4">{task.description}</p>
                <div className="flex flex-col gap-2 mt-auto mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600"><Wrench size={14} className="text-indigo-400" /> {task.category}</div>
                  <div className="flex items-center gap-2 text-sm text-slate-600"><MapPin size={14} className="text-emerald-500" /> Resident: {task.residentName || 'N/A'}</div>
                </div>
                <div className="flex gap-2">
                  {task.status === 'Assigned' && (
                    <button onClick={() => updateMutation.mutate({ id: task._id, status: 'In Progress' })} className="flex-1 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition-colors">Start Work</button>
                  )}
                  {task.status === 'In Progress' && (
                    <button onClick={() => updateMutation.mutate({ id: task._id, status: 'Resolved' })} className="flex-1 py-2 bg-green-50 hover:bg-green-100 text-green-700 font-bold text-xs rounded-xl transition-colors">Mark Resolved</button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
