import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const MOCK_JOBS = [
  { id: 1, title: 'Gym Equipment Maintenance', status: 'In Progress', date: '2023-11-01' },
  { id: 2, title: 'Lobby Painting', status: 'Completed', date: '2023-10-15' },
];

export default function MyJobsPage() {
  const [jobs, setJobs] = useState(MOCK_JOBS);

  const markComplete = (id) => {
    setJobs(jobs.map(j => j.id === id ? { ...j, status: 'Completed' } : j));
    toast.success('Job marked as completed');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Jobs</h1>
          <p className="text-slate-500 text-sm mt-1">Track your awarded contracts and jobs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {jobs.map((job, i) => (
          <motion.div key={job.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={`bg-white p-6 rounded-2xl border ${job.status === 'Completed' ? 'border-slate-200/60 opacity-80' : 'border-indigo-100 shadow-sm'} flex flex-col`}>
            <div className="flex justify-between items-start mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${job.status === 'Completed' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                {job.status}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={12}/> {job.date}</span>
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-4">{job.title}</h3>
            
            {job.status === 'In Progress' && (
              <button onClick={() => markComplete(job.id)} className="mt-auto py-2 bg-green-50 hover:bg-green-100 text-green-700 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
                <CheckCircle size={16} /> Mark Completed
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
