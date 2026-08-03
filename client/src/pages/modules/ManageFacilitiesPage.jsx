import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Building2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { facilityService } from '../../services/facility.service';

export default function ManageFacilitiesPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('');

  const { data: bookingsRes, isLoading } = useQuery({
    queryKey: ['all-bookings'],
    queryFn: () => facilityService.getBookings(),
  });

  const bookings = bookingsRes?.data || [];
  
  const filteredBookings = filter ? bookings.filter(b => b.status === filter) : bookings;

  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: ({ id, status }) => facilityService.updateBookingStatus(id, status),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries(['all-bookings']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update booking')
  });

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Manage Facility Bookings</h1>
          <p className="text-sm text-slate-500 mt-1">Approve or reject resident booking requests</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-2 overflow-x-auto hide-scrollbar">
          {['', 'pending', 'approved', 'rejected', 'completed'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                filter === f ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}>
              {f ? f.charAt(0).toUpperCase() + f.slice(1) : 'All Requests'}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-bold border-b border-slate-100">Resident</th>
                <th className="p-4 font-bold border-b border-slate-100">Facility</th>
                <th className="p-4 font-bold border-b border-slate-100">Date & Time</th>
                <th className="p-4 font-bold border-b border-slate-100">Status</th>
                <th className="p-4 font-bold border-b border-slate-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">Loading bookings...</td></tr>
              ) : filteredBookings.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">No bookings found.</td></tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{booking.resident?.first_name} {booking.resident?.last_name}</div>
                      <div className="text-xs text-slate-500">Flat {booking.resident?.flat_number}</div>
                    </td>
                    <td className="p-4 font-semibold text-slate-700">{booking.facilityId?.name}</td>
                    <td className="p-4 text-slate-600">
                      <div>{new Date(booking.date).toLocaleDateString()}</div>
                      <div className="text-xs">{booking.startTime} - {booking.endTime}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        booking.status === 'approved' ? 'bg-green-100 text-green-700' :
                        booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        booking.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {booking.status === 'pending' && (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => updateStatus({ id: booking._id, status: 'approved' })}
                            disabled={isPending}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Approve"
                          >
                            <CheckCircle size={20} />
                          </button>
                          <button 
                            onClick={() => updateStatus({ id: booking._id, status: 'rejected' })}
                            disabled={isPending}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject"
                          >
                            <XCircle size={20} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
