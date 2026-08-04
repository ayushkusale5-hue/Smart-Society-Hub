import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Car, Plus, LogOut, Clock, Search, X } from 'lucide-react';
import { vehicleService } from '../../services/vehicle.service';
import toast from 'react-hot-toast';

const VEHICLE_TYPES = ['Car', 'Bike', 'Auto', 'Truck', 'Other'];

export default function VehicleLogsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState({ vehicleNumber: '', vehicleType: 'Car', driverName: '', purpose: '', flatNumber: '', notes: '' });

  const { data: res, isLoading } = useQuery({
    queryKey: ['vehicle-logs', dateFilter, searchQuery],
    queryFn: () => vehicleService.getLogs({ date: dateFilter || undefined, vehicleNumber: searchQuery || undefined }),
  });
  const logs = res?.data || [];

  const entryMutation = useMutation({
    mutationFn: () => vehicleService.logEntry(form),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['vehicle-logs'] }); toast.success('Vehicle entry logged'); setIsModalOpen(false); setForm({ vehicleNumber: '', vehicleType: 'Car', driverName: '', purpose: '', flatNumber: '', notes: '' }); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const exitMutation = useMutation({
    mutationFn: (id) => vehicleService.logExit(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['vehicle-logs'] }); toast.success('Vehicle exit logged'); },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vehicle Logs</h1>
          <p className="text-slate-500 text-sm mt-1">Track vehicle entry and exit at the gate</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary shadow-lg shadow-indigo-200">
          <Plus size={20} /> Log Entry
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input pl-10" placeholder="Search vehicle number..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <input type="date" className="input max-w-[180px]" value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
        {dateFilter && <button onClick={() => setDateFilter('')} className="text-xs text-slate-400 hover:text-slate-600 underline">Clear</button>}
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-slate-100/50 rounded-2xl animate-pulse" />)}</div>
      ) : logs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/60 shadow-sm">
          <Car size={40} className="mx-auto mb-3 text-indigo-300" />
          <h3 className="text-lg font-bold text-slate-900 mb-1">No vehicle logs</h3>
          <p className="text-slate-500 text-sm">No vehicles logged for this period.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/80">
                  {['Vehicle #', 'Type', 'Driver', 'Flat', 'Purpose', 'Entry', 'Exit', 'Action'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
                  <motion.tr key={log._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4 text-sm font-bold text-slate-900">{log.vehicleNumber}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{log.vehicleType}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{log.driverName || '—'}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{log.flatNumber || '—'}</td>
                    <td className="px-5 py-4 text-sm text-slate-500">{log.purpose || '—'}</td>
                    <td className="px-5 py-4 text-xs text-slate-500">{new Date(log.entryTime).toLocaleTimeString()}</td>
                    <td className="px-5 py-4 text-xs">{log.exitTime ? <span className="text-green-600 font-bold">{new Date(log.exitTime).toLocaleTimeString()}</span> : <span className="text-amber-600 font-bold">Inside</span>}</td>
                    <td className="px-5 py-4">
                      {!log.exitTime && (
                        <button onClick={() => exitMutation.mutate(log._id)} className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1">
                          <LogOut size={12} /> Exit
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Log Entry Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Log Vehicle Entry</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group"><label className="label">Vehicle Number *</label>
                <input className="input" value={form.vehicleNumber} onChange={e => setForm({ ...form, vehicleNumber: e.target.value.toUpperCase() })} placeholder="e.g. MH12AB1234" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group"><label className="label">Vehicle Type</label>
                  <select className="input" value={form.vehicleType} onChange={e => setForm({ ...form, vehicleType: e.target.value })}>
                    {VEHICLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                <div className="form-group"><label className="label">Flat Number</label>
                  <input className="input" value={form.flatNumber} onChange={e => setForm({ ...form, flatNumber: e.target.value })} placeholder="e.g. A-204" /></div>
              </div>
              <div className="form-group"><label className="label">Driver Name</label>
                <input className="input" value={form.driverName} onChange={e => setForm({ ...form, driverName: e.target.value })} placeholder="Driver name" /></div>
              <div className="form-group"><label className="label">Purpose</label>
                <input className="input" value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })} placeholder="e.g. Delivery, Guest, Resident" /></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => entryMutation.mutate()} disabled={entryMutation.isPending || !form.vehicleNumber}>
                {entryMutation.isPending ? 'Logging...' : 'Log Entry'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
