import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, X, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { parkingService } from '../../services/parking.service';
import { useAuthStore } from '../../store/authStore';

export default function ParkingPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [vehicleNumber, setVehicleNumber] = useState('');

  const { data: res, isLoading } = useQuery({
    queryKey: ['parking'],
    queryFn: () => parkingService.getParkingSlots(),
  });

  const slots = res?.data || [];
  
  
  const mySlots = slots.filter(s => s.assignedTo === user?.id);
  const guestSlots = slots.filter(s => s.isGuest);

  const { mutate: updateVehicle, isPending } = useMutation({
    mutationFn: ({ id, number }) => parkingService.updateMyVehicle(id, number),
    onSuccess: () => {
      toast.success('Vehicle number updated!');
      setSelectedSlot(null);
      queryClient.invalidateQueries(['parking']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update vehicle')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!vehicleNumber) return toast.error('Vehicle number is required');
    updateVehicle({ id: selectedSlot._id, number: vehicleNumber });
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-10">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">My Parking</h2>
        <p className="text-slate-500 mt-1">Manage your assigned parking slots and vehicles</p>
      </div>

      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">My Assigned Slots</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <div className="col-span-full py-10 text-slate-500">Loading slots...</div>
          ) : mySlots.length === 0 ? (
            <div className="col-span-full py-10 bg-white rounded-2xl border border-slate-200 text-center text-slate-500">
              You do not have any assigned parking slots. Contact the committee if you need one.
            </div>
          ) : mySlots.map((slot, i) => (
            <motion.div
              key={slot._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-5 border border-indigo-200 shadow-sm shadow-indigo-100 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl">
                  {slot.slotNumber}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 capitalize">{slot.type} Parking</h3>
                  <p className="text-sm font-semibold text-slate-500 mt-1">
                    {slot.vehicleNumber || 'No vehicle assigned'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setSelectedSlot(slot);
                  setVehicleNumber(slot.vehicleNumber || '');
                }}
                className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 px-3 py-1.5 rounded-lg"
              >
                Update
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Guest Parking Areas (Free Allocation)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {isLoading ? (
            <div className="col-span-full py-10 text-slate-500">Loading guest slots...</div>
          ) : (
            guestSlots.map(slot => (
              <div key={slot._id} className={`p-4 rounded-xl border ${slot.status === 'available' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'} flex flex-col items-center justify-center gap-2`}>
                <Car size={24} />
                <span className="font-bold">{slot.slotNumber}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedSlot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-sm max-w-[calc(100vw-32px)] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900">Slot {selectedSlot.slotNumber}</h2>
                <button onClick={() => setSelectedSlot(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500">
                  <X size={16} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="bg-blue-50 text-blue-800 p-4 rounded-xl flex gap-3 text-sm font-medium">
                  <Info className="shrink-0" size={18} />
                  Registering your vehicle plate helps security identify unauthorized parking.
                </div>

                <div className="form-group mb-0">
                  <label className="label">Vehicle Number Plate</label>
                  <input className="input" required value={vehicleNumber} onChange={e => setVehicleNumber(e.target.value.toUpperCase())} placeholder="e.g. MH 12 AB 1234" />
                </div>

                <button type="submit" disabled={isPending} className="btn btn-primary w-full py-3 mt-2">
                  {isPending ? 'Updating...' : 'Save Vehicle'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
