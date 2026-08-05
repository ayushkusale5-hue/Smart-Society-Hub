import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Users, X, Info, CheckCircle, IndianRupee, MapPin } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { facilityService } from '../../services/facility.service';

export default function FacilitiesPage() {
  const queryClient = useQueryClient();
  const [selectedFacility, setSelectedFacility] = useState(null);
  
  const [form, setForm] = useState({
    date: '',
    startTime: '',
    endTime: '',
    purpose: ''
  });

  const { data: facilitiesRes, isLoading: isLoadingFacilities } = useQuery({
    queryKey: ['facilities'],
    queryFn: () => facilityService.getFacilities(),
  });

  const { data: bookingsRes, isLoading: isLoadingBookings } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => facilityService.getBookings(),
  });

  const facilities = facilitiesRes?.data || [];
  const bookings = bookingsRes?.data || [];

  const { mutate: bookFacility, isPending } = useMutation({
    mutationFn: (data) => facilityService.bookFacility(data),
    onSuccess: () => {
      toast.success('Facility booked successfully!');
      setSelectedFacility(null);
      queryClient.invalidateQueries(['my-bookings']);
      setForm({ date: '', startTime: '', endTime: '', purpose: '' });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to book facility')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.date || !form.startTime || !form.endTime) return toast.error('Date and time are required');
    
    const start = parseInt(form.startTime.split(':')[0]);
    const end = parseInt(form.endTime.split(':')[0]);
    
    if (start >= end) return toast.error('End time must be after start time');
    
    bookFacility({ ...form, facilityId: selectedFacility._id });
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-10">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Facility Booking</h2>
        <p className="text-slate-500 mt-1">Reserve common areas and amenities</p>
      </div>

      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Available Facilities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoadingFacilities ? (
            <div className="col-span-full py-10 text-slate-500">Loading facilities...</div>
          ) : facilities.map((facility, i) => (
            <motion.div
              key={facility._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full"
              onClick={() => setSelectedFacility(facility)}
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <MapPin size={20} />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">{facility.name}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">{facility.description}</p>
              
              <div className="flex items-center justify-between text-sm font-semibold border-t border-slate-100 pt-4 mt-auto">
                <div className="flex items-center gap-1 text-slate-700">
                  <Users size={16} className="text-slate-400" />
                  {facility.capacity}
                </div>
                <div className="flex items-center gap-1 text-indigo-700">
                  <IndianRupee size={16} />
                  {facility.pricePerHour}/hr
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">My Bookings</h3>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-sm">
          <table className="w-full min-w-[800px] text-left whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-bold">Facility</th>
                <th className="p-4 font-bold">Date & Time</th>
                <th className="p-4 font-bold">Duration</th>
                <th className="p-4 font-bold">Amount</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {isLoadingBookings ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">Loading bookings...</td></tr>
              ) : bookings.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">No bookings yet.</td></tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking._id} className="border-t border-slate-100 hover:bg-slate-50/50">
                    <td className="p-4 font-semibold text-slate-900">{booking.facilityId?.name || 'Unknown Facility'}</td>
                    <td className="p-4 text-slate-600">
                      <div>{new Date(booking.date).toLocaleDateString()}</div>
                      <div className="text-xs">{booking.startTime} - {booking.endTime}</div>
                    </td>
                    <td className="p-4 text-slate-600">{booking.duration} hrs</td>
                    <td className="p-4 font-bold text-slate-900">₹{booking.amount}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${
                        booking.status === 'approved' ? 'bg-green-100 text-green-700' :
                        booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        booking.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {booking.status !== 'rejected' && booking.status !== 'cancelled' && (
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to cancel this booking?')) {
                              facilityService.deleteBooking(booking._id)
                                .then(() => toast.success('Booking canceled'))
                                .catch(err => toast.error(err.response?.data?.message || 'Failed to cancel'))
                                .finally(() => queryClient.invalidateQueries(['my-bookings']));
                            }
                          }}
                          className="text-red-500 hover:text-red-700 text-xs font-bold transition-colors bg-red-50 px-2 py-1 rounded"
                        >
                          Cancel
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
        {selectedFacility && (
          <div className="modal-backdrop">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="modal-content">
              <div className="modal-header">
                <h2>Book {selectedFacility.name}</h2>
                <button onClick={() => setSelectedFacility(null)} className="modal-close">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="modal-body pb-6">
                <div className="bg-blue-50 text-blue-800 p-4 rounded-xl flex gap-3 text-sm font-medium">
                  <Info className="shrink-0" size={18} />
                  <div>
                    <p>Rate: ₹{selectedFacility.pricePerHour} per hour</p>
                    {selectedFacility.requiresApproval && <p className="mt-1">Requires committee approval.</p>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="label">Date</label>
                  <input type="date" required min={new Date().toISOString().split('T')[0]} className="input" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="label">Start Time</label>
                    <input type="time" required className="input" value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="label">End Time</label>
                    <input type="time" required className="input" value={form.endTime} onChange={e => setForm({...form, endTime: e.target.value})} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="label">Purpose (Optional)</label>
                  <input className="input" placeholder="e.g. Birthday Party" value={form.purpose} onChange={e => setForm({...form, purpose: e.target.value})} />
                </div>

                <div className="mt-2">
                  <button type="submit" disabled={isPending} className="btn btn-primary w-full py-3.5">
                    {isPending ? 'Processing...' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
