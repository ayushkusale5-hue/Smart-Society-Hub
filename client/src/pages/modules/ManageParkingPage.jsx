import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, X, Users, CheckCircle, ShieldAlert } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { parkingService } from '../../services/parking.service';
import { userService } from '../../services/user.service';

export default function ManageParkingPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState(''); 
  const [search, setSearch] = useState('');
  
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [assignedTo, setAssignedTo] = useState('');

  const { data: slotsRes, isLoading: isLoadingSlots } = useQuery({
    queryKey: ['parking'],
    queryFn: () => parkingService.getParkingSlots(),
  });

  const { data: usersRes } = useQuery({
    queryKey: ['residents'],
    queryFn: () => userService.getUsers(),
  });

  const slots = slotsRes?.data || [];
  const residents = (usersRes?.data || []).filter(u => u.role === 'resident' && u.is_active);

  const filteredSlots = useMemo(() => {
    return slots.filter(s => {
      if (filter === 'guest' && !s.isGuest) return false;
      if (filter === 'available' && (s.status !== 'available' || s.isGuest)) return false;
      if (filter === 'occupied' && (s.status !== 'occupied' || s.isGuest)) return false;
      
      if (search) {
        const query = search.toLowerCase();
        const slotMatch = s.slotNumber.toLowerCase().includes(query);
        const residentMatch = s.resident ? `${s.resident.first_name} ${s.resident.last_name}`.toLowerCase().includes(query) : false;
        const plateMatch = s.vehicleNumber ? s.vehicleNumber.toLowerCase().includes(query) : false;
        return slotMatch || residentMatch || plateMatch;
      }
      return true;
    });
  }, [slots, filter, search]);

  const { mutate: assignSlot, isPending } = useMutation({
    mutationFn: ({ id, data }) => parkingService.assignSlot(id, data),
    onSuccess: (res) => {
      toast.success(res.message);
      setSelectedSlot(null);
      queryClient.invalidateQueries(['parking']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update slot')
  });

  const handleAssign = (e) => {
    e.preventDefault();
    assignSlot({ 
      id: selectedSlot._id, 
      data: { assignedTo: assignedTo || null, vehicleNumber: '' } 
    });
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Parking Management</h1>
          <p className="text-sm text-slate-500 mt-1">Assign parking slots and track society vehicles</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <input 
            type="text" 
            placeholder="Search slot, resident, or plate..." 
            className="input max-w-sm w-full bg-slate-50 border-transparent focus:bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
            {['', 'available', 'occupied', 'guest'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                  filter === f ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}>
                {f ? f.charAt(0).toUpperCase() + f.slice(1) : 'All Slots'}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-bold border-b border-slate-100">Slot</th>
                <th className="p-4 font-bold border-b border-slate-100">Type</th>
                <th className="p-4 font-bold border-b border-slate-100">Assigned To</th>
                <th className="p-4 font-bold border-b border-slate-100">Vehicle</th>
                <th className="p-4 font-bold border-b border-slate-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {isLoadingSlots ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">Loading parking data...</td></tr>
              ) : filteredSlots.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">No parking slots found.</td></tr>
              ) : (
                filteredSlots.map((slot) => (
                  <tr key={slot._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-black text-slate-900 text-base">{slot.slotNumber}</div>
                      {slot.isGuest && <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Guest Slot</span>}
                    </td>
                    <td className="p-4 font-semibold text-slate-700 capitalize">{slot.type}</td>
                    <td className="p-4">
                      {slot.resident ? (
                        <div>
                          <div className="font-bold text-slate-900">{slot.resident.first_name} {slot.resident.last_name}</div>
                          <div className="text-xs text-slate-500">Flat {slot.resident.flat_number}</div>
                        </div>
                      ) : slot.isGuest ? (
                        <span className="text-slate-400 font-medium italic">General Use</span>
                      ) : (
                        <span className="text-slate-400 font-medium italic">Unassigned</span>
                      )}
                    </td>
                    <td className="p-4">
                      {slot.vehicleNumber ? (
                        <span className="font-mono bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md font-bold tracking-widest text-xs">
                          {slot.vehicleNumber}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {!slot.isGuest && (
                        <button 
                          onClick={() => {
                            setSelectedSlot(slot);
                            setAssignedTo(slot.assignedTo || '');
                          }}
                          className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg"
                        >
                          {slot.assignedTo ? 'Reassign' : 'Assign'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedSlot && (
          <div className="modal-backdrop">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="modal-content">
              <div className="modal-header">
                <h2 className="text-xl font-bold text-slate-900">Manage Slot {selectedSlot.slotNumber}</h2>
                <button onClick={() => setSelectedSlot(null)} className="modal-close">
                  <X size={16} />
                </button>
              </div>
              <form onSubmit={handleAssign} className="modal-body p-6 space-y-4">
                <div className="form-group mb-0">
                  <label className="label">Assign to Resident</label>
                  <select 
                    className="input" 
                    value={assignedTo} 
                    onChange={e => setAssignedTo(e.target.value)}
                  >
                    <option value="">-- Unassigned (Free Slot) --</option>
                    {residents.map(r => (
                      <option key={r.id} value={r.id}>{r.first_name} {r.last_name} (Flat {r.flat_number})</option>
                    ))}
                  </select>
                </div>
                {selectedSlot.assignedTo && assignedTo === '' && (
                  <div className="bg-amber-50 text-amber-800 p-3 rounded-xl flex gap-2 text-sm font-medium mt-2">
                    <ShieldAlert className="shrink-0 text-amber-600" size={18} />
                    This will revoke the parking slot from the current resident and wipe their vehicle data.
                  </div>
                )}
                <button type="submit" disabled={isPending} className="btn btn-primary w-full py-3 mt-4">
                  {isPending ? 'Saving...' : 'Save Allocation'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
