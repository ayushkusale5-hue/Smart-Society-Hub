import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, MapPin, Clock, Users, Plus, X, Trash2, Edit2 } from 'lucide-react';
import { eventService } from '../../services/event.service';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

const CATEGORIES = ['Festival', 'Meeting', 'Sports', 'Cultural', 'Maintenance', 'General', 'Other'];

export default function ManageEventsPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', date: '', time: '', venue: '', category: 'General', maxAttendees: 0, organizer: '' });
  const [editingId, setEditingId] = useState(null);

  const { data: res, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => eventService.getAll(),
  });
  const events = res?.data || [];

  const createMutation = useMutation({
    mutationFn: (data) => eventService.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['events'] }); toast.success('Event created'); closeAndReset(); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => eventService.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['events'] }); toast.success('Event updated'); closeAndReset(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => eventService.remove(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['events'] }); toast.success('Event deleted'); },
  });

  const closeAndReset = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm({ title: '', description: '', date: '', time: '', venue: '', category: 'General', maxAttendees: 0, organizer: '' });
  };

  const openEdit = (ev) => {
    setEditingId(ev._id);
    setForm({
      title: ev.title, description: ev.description, date: new Date(ev.date).toISOString().split('T')[0],
      time: ev.time || '', venue: ev.venue || '', category: ev.category, maxAttendees: ev.maxAttendees || 0, organizer: ev.organizer || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (editingId) updateMutation.mutate({ id: editingId, data: form });
    else createMutation.mutate(form);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Events</h1>
          <p className="text-slate-500 text-sm mt-1">Create and organize society events</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary shadow-lg shadow-indigo-200">
          <Plus size={20} /> Create Event
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">{[1,2,3].map(i => <div key={i} className="h-64 bg-slate-100/50 rounded-2xl animate-pulse" />)}</div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/60 shadow-sm">
          <Calendar size={40} className="mx-auto mb-3 text-indigo-300" />
          <h3 className="text-lg font-bold text-slate-900 mb-1">No events</h3>
          <p className="text-slate-500 text-sm">Create an event to bring the community together.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((ev, i) => {
            const isPast = new Date(ev.date) < new Date(new Date().setHours(0,0,0,0));
            const going = ev.rsvps?.filter(r => r.status === 'Going').length || 0;
            return (
              <motion.div key={ev._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className={`bg-white p-6 rounded-2xl border ${isPast ? 'border-slate-200/60 opacity-60' : 'border-indigo-100 shadow-sm hover:shadow-md'} transition-all flex flex-col`}>
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600">{ev.category}</span>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(ev)} className="p-1.5 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-lg"><Edit2 size={14} /></button>
                    <button onClick={() => { if(window.confirm('Delete this event?')) deleteMutation.mutate(ev._id); }} className="p-1.5 text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{ev.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4">{ev.description}</p>
                <div className="space-y-2 mb-4 mt-auto">
                  <div className="flex items-center gap-2 text-sm text-slate-600"><Calendar size={14} className="text-indigo-400" /> {new Date(ev.date).toLocaleDateString()}</div>
                  {ev.time && <div className="flex items-center gap-2 text-sm text-slate-600"><Clock size={14} className="text-amber-500" /> {ev.time}</div>}
                  {ev.venue && <div className="flex items-center gap-2 text-sm text-slate-600"><MapPin size={14} className="text-emerald-500" /> {ev.venue}</div>}
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Users size={16} className="text-blue-500" /> {going} {ev.maxAttendees > 0 ? `/ ${ev.maxAttendees}` : ''} Going
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={closeAndReset}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? 'Edit Event' : 'Create Event'}</h2>
              <button className="modal-close" onClick={closeAndReset}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group"><label className="label">Title *</label>
                <input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
              <div className="form-group"><label className="label">Description *</label>
                <textarea className="input" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group"><label className="label">Date *</label>
                  <input type="date" className="input" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
                <div className="form-group"><label className="label">Time</label>
                  <input type="time" className="input" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} /></div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group"><label className="label">Category</label>
                  <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                <div className="form-group"><label className="label">Max Attendees (0 for unltd)</label>
                  <input type="number" className="input" value={form.maxAttendees} onChange={e => setForm({ ...form, maxAttendees: Number(e.target.value) })} /></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group"><label className="label">Venue</label>
                  <input className="input" value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} /></div>
                <div className="form-group"><label className="label">Organizer Name</label>
                  <input className="input" value={form.organizer} onChange={e => setForm({ ...form, organizer: e.target.value })} /></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={closeAndReset}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending || !form.title || !form.date || !form.description}>
                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Event'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
