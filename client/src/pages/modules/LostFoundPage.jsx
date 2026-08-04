import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Plus, MapPin, Clock, Phone, X, AlertTriangle } from 'lucide-react';
import { lostFoundService } from '../../services/lostfound.service';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

const CATEGORIES = ['Electronics', 'Keys', 'Wallet', 'Documents', 'Clothing', 'Pet', 'Other'];
const TYPES = ['Lost', 'Found'];
const STATUSES = ['Active', 'Claimed', 'Resolved'];

export default function LostFoundPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('Active');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', type: 'Lost', category: 'Other', location: '', contactPhone: '' });

  const { data: res, isLoading } = useQuery({
    queryKey: ['lost-found', filterType, filterStatus],
    queryFn: () => lostFoundService.getAll({ type: filterType || undefined, status: filterStatus || undefined }),
  });
  const items = res?.data || [];

  const createMutation = useMutation({
    mutationFn: (data) => lostFoundService.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['lost-found'] }); toast.success('Item reported successfully'); setIsModalOpen(false); setForm({ title: '', description: '', type: 'Lost', category: 'Other', location: '', contactPhone: '' }); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to report item'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => lostFoundService.update(id, { status }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['lost-found'] }); toast.success('Status updated'); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => lostFoundService.remove(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['lost-found'] }); toast.success('Item deleted'); },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lost & Found</h1>
          <p className="text-slate-500 text-sm mt-1">Report lost items or post found items</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary shadow-lg shadow-indigo-200">
          <Plus size={20} /> Report Item
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl w-fit">
          <button onClick={() => setFilterType('')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filterType === '' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>All</button>
          <button onClick={() => setFilterType('Lost')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filterType === 'Lost' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Lost Items</button>
          <button onClick={() => setFilterType('Found')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filterType === 'Found' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Found Items</button>
        </div>
        <div className="flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl w-fit">
          {STATUSES.map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filterStatus === s ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{s}</button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">{[1,2,3].map(i => <div key={i} className="h-48 bg-slate-100/50 rounded-2xl animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/60 shadow-sm">
          <Search size={40} className="mx-auto mb-3 text-indigo-300" />
          <h3 className="text-lg font-bold text-slate-900 mb-1">No items found</h3>
          <p className="text-slate-500 text-sm">There are no {filterType.toLowerCase()} items matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <motion.div key={item._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${item.type === 'Lost' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                  {item.type}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">{item.status}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-1">{item.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mb-4">{item.description}</p>
              
              <div className="space-y-2 mb-4 mt-auto">
                <div className="flex items-center gap-2 text-sm text-slate-600"><AlertTriangle size={14} className="text-indigo-400" /> {item.category}</div>
                {item.location && <div className="flex items-center gap-2 text-sm text-slate-600"><MapPin size={14} className="text-emerald-500" /> {item.location}</div>}
                {item.contactPhone && <div className="flex items-center gap-2 text-sm text-slate-600"><Phone size={14} className="text-amber-500" /> {item.contactPhone}</div>}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock size={12} /> {new Date(item.date || item.createdAt).toLocaleDateString()}
                </div>
                <div className="flex gap-2">
                  {item.status === 'Active' && item.type === 'Found' && item.reportedBy !== String(user.id) && (
                    <button onClick={() => updateMutation.mutate({ id: item._id, status: 'Claimed' })} className="text-xs font-bold text-indigo-600 hover:text-indigo-800">Claim This</button>
                  )}
                  {item.status === 'Active' && item.reportedBy === String(user.id) && (
                    <button onClick={() => updateMutation.mutate({ id: item._id, status: 'Resolved' })} className="text-xs font-bold text-green-600 hover:text-green-800">Mark Resolved</button>
                  )}
                  {(item.reportedBy === String(user.id) || user.role === 'committee') && (
                    <button onClick={() => { if(window.confirm('Delete this item?')) deleteMutation.mutate(item._id); }} className="text-xs font-bold text-red-500 hover:text-red-700 ml-2">Delete</button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Report Lost/Found Item</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group"><label className="label">Type</label>
                  <select className="input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    {TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                <div className="form-group"><label className="label">Category</label>
                  <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              </div>
              <div className="form-group"><label className="label">Title *</label>
                <input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Black Leather Wallet" /></div>
              <div className="form-group"><label className="label">Description *</label>
                <textarea className="input" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Details about the item..." /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group"><label className="label">Location</label>
                  <input className="input" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. Club House" /></div>
                <div className="form-group"><label className="label">Contact Phone</label>
                  <input className="input" value={form.contactPhone} onChange={e => setForm({ ...form, contactPhone: e.target.value })} placeholder="Optional" /></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => createMutation.mutate(form)} disabled={createMutation.isPending || !form.title || !form.description}>
                {createMutation.isPending ? 'Reporting...' : 'Submit Report'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
