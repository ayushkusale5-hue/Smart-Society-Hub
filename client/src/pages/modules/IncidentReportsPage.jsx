import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, Plus, Shield, MapPin, Clock, X } from 'lucide-react';
import { incidentService } from '../../services/incident.service';
import toast from 'react-hot-toast';

const CATEGORIES = ['Theft', 'Vandalism', 'Trespassing', 'Fire', 'Flood', 'Noise', 'Suspicious Activity', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
const STATUSES = ['Open', 'Investigating', 'Resolved', 'Closed'];

const STATUS_STYLE = {
  Open: { color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
  Investigating: { color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  Resolved: { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  Closed: { color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb' },
};

const PRIORITY_STYLE = {
  Low: { color: '#16a34a', bg: '#f0fdf4' },
  Medium: { color: '#d97706', bg: '#fffbeb' },
  High: { color: '#ea580c', bg: '#fff7ed' },
  Critical: { color: '#dc2626', bg: '#fef2f2' },
};

export default function IncidentReportsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'Other', priority: 'Medium', location: '' });

  const { data: res, isLoading } = useQuery({
    queryKey: ['incidents', filter],
    queryFn: () => incidentService.getAll(filter ? { status: filter } : {}),
  });
  const incidents = res?.data || [];

  const createMutation = useMutation({
    mutationFn: () => {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      return incidentService.create(fd);
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['incidents'] }); toast.success('Incident reported'); setIsModalOpen(false); setForm({ title: '', description: '', category: 'Other', priority: 'Medium', location: '' }); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => incidentService.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['incidents'] }); toast.success('Incident updated'); },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Incident Reports</h1>
          <p className="text-slate-500 text-sm mt-1">Report and track security incidents</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary shadow-lg shadow-indigo-200">
          <Plus size={20} /> Report Incident
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 bg-slate-100/80 p-1.5 rounded-2xl w-fit">
        {['', ...STATUSES].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${filter === s ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {s || 'All'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{[1,2,3,4].map(i => <div key={i} className="h-48 bg-slate-100/50 rounded-2xl animate-pulse" />)}</div>
      ) : incidents.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/60 shadow-sm">
          <Shield size={40} className="mx-auto mb-3 text-indigo-300" />
          <h3 className="text-lg font-bold text-slate-900 mb-1">No incidents</h3>
          <p className="text-slate-500 text-sm">No security incidents have been reported.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {incidents.map(inc => {
            const st = STATUS_STYLE[inc.status] || STATUS_STYLE.Open;
            const pr = PRIORITY_STYLE[inc.priority] || PRIORITY_STYLE.Medium;
            return (
              <motion.div key={inc._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ color: st.color, background: st.bg, border: `1px solid ${st.border}` }}>{inc.status}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ color: pr.color, background: pr.bg }}>{inc.priority}</span>
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{inc.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-3">{inc.description}</p>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-auto">
                  <span className="flex items-center gap-1"><AlertTriangle size={12} /> {inc.category}</span>
                  {inc.location && <span className="flex items-center gap-1"><MapPin size={12} /> {inc.location}</span>}
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={10} /> {new Date(inc.createdAt).toLocaleDateString()}</span>
                  {(inc.status === 'Open' || inc.status === 'Investigating') && (
                    <select className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1" value={inc.status}
                      onChange={e => updateMutation.mutate({ id: inc._id, data: { status: e.target.value } })}>
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Report Incident</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group"><label className="label">Title *</label>
                <input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Brief title" /></div>
              <div className="form-group"><label className="label">Description *</label>
                <textarea className="input" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Detailed description" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group"><label className="label">Category</label>
                  <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                <div className="form-group"><label className="label">Priority</label>
                  <select className="input" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                    {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
              </div>
              <div className="form-group"><label className="label">Location</label>
                <input className="input" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. Tower B, Floor 3" /></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !form.title || !form.description}>
                {createMutation.isPending ? 'Reporting...' : 'Report Incident'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
