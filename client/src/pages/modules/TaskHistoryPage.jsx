import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { History, Wrench, Clock, CheckCircle } from 'lucide-react';
import { complaintService } from '../../services/complaint.service';

export default function TaskHistoryPage() {
  const [filter, setFilter] = useState('');

  const { data: res, isLoading } = useQuery({
    queryKey: ['task-history'],
    queryFn: () => complaintService.getAll(),
  });
  
  // Completed tasks
  const tasks = (res?.data || []).filter(c => c.status === 'Resolved' || c.status === 'Closed');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Task History</h1>
          <p className="text-slate-500 text-sm mt-1">Review your completed maintenance jobs</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 bg-slate-100/80 p-1.5 rounded-2xl w-fit">
        {['', 'Resolved', 'Closed'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${filter === s ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {s || 'All Completed'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">{[1,2,3].map(i => <div key={i} className="h-48 bg-slate-100/50 rounded-2xl animate-pulse" />)}</div>
      ) : tasks.filter(t => filter ? t.status === filter : true).length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/60 shadow-sm">
          <History size={40} className="mx-auto mb-3 text-indigo-300" />
          <h3 className="text-lg font-bold text-slate-900 mb-1">No task history</h3>
          <p className="text-slate-500 text-sm">Your completed tasks will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {tasks.filter(t => filter ? t.status === filter : true).map((task, i) => (
            <motion.div key={task._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all flex flex-col opacity-80 hover:opacity-100">
              <div className="flex justify-between items-start mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-100">{task.status}</span>
              </div>
              <h3 className="font-bold text-slate-900 mb-1">{task.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mb-4">{task.description}</p>
              <div className="flex flex-col gap-2 mt-auto pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-500"><CheckCircle size={12} className="text-green-500" /> Completed on {new Date(task.updatedAt).toLocaleDateString()}</div>
                <div className="flex items-center gap-2 text-xs text-slate-500"><Wrench size={12} className="text-indigo-400" /> {task.category}</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
