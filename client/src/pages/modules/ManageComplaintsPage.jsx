import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Filter, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { complaintService } from '../../services/complaint.service';
import { useAuthStore } from '../../store/authStore';
import { format } from 'date-fns';

const STATUS_OPTIONS = ['Pending', 'Assigned', 'In Progress', 'Resolved', 'Closed'];
const STATUS_COLORS = {
  'Pending': 'bg-amber-100 text-amber-800',
  'Assigned': 'bg-blue-100 text-blue-800',
  'In Progress': 'bg-purple-100 text-purple-800',
  'Resolved': 'bg-emerald-100 text-emerald-800',
  'Closed': 'bg-slate-100 text-slate-800',
};

export default function ManageComplaintsPage() {
  const queryClient = useQueryClient();
  const { isRole } = useAuthStore();
  const isCommittee = isRole('committee');

  const { data: response, isLoading } = useQuery({
    queryKey: ['manage-complaints'],
    queryFn: () => complaintService.getComplaints(),
  });

  const complaints = response?.data || [];

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ id, status }) => complaintService.updateStatus(id, status),
    onSuccess: () => {
      toast.success('Status updated successfully');
      queryClient.invalidateQueries(['manage-complaints']);
    },
    onError: () => toast.error('Failed to update status'),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isCommittee ? 'Manage Complaints' : 'My Assigned Tasks'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">Review and update maintenance requests</p>
        </div>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-100/50 rounded-[2rem] border border-slate-200/50" />)}
        </div>
      ) : complaints.length === 0 ? (
        <div className="text-center py-24 bg-gradient-to-b from-white to-slate-50/50 rounded-[2rem] border border-slate-200/60 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.05)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 opacity-20"></div>
          <div className="w-20 h-20 bg-emerald-50/80 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-emerald-100/50 transform -rotate-3">
            <CheckCircle size={32} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">All clear!</h3>
          <p className="text-slate-500 font-medium">No complaints require your attention right now.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-200/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-bold">
                  <th className="p-4 pl-6">Details</th>
                  <th className="p-4">Category / Priority</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 pr-6 w-48">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.map(complaint => (
                  <tr key={complaint._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-bold text-slate-900 mb-1">{complaint.title}</div>
                      <div className="text-sm text-slate-500 line-clamp-1 max-w-md">{complaint.description}</div>
                      {complaint.images?.length > 0 && (
                        <div className="text-xs font-bold text-indigo-500 mt-2">
                          {complaint.images.length} Image(s) Attached
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-1">
                        <AlertCircle size={14} className="text-slate-400" />
                        {complaint.category}
                      </div>
                      <div className="text-xs font-bold text-slate-500 uppercase">{complaint.priority} Priority</div>
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-600">
                      {format(new Date(complaint.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="p-4 pr-6">
                      <select
                        value={complaint.status}
                        onChange={(e) => updateStatus({ id: complaint._id, status: e.target.value })}
                        className={`w-full px-3 py-2 rounded-xl text-sm font-bold border-0 outline-none appearance-none cursor-pointer text-center ${STATUS_COLORS[complaint.status]}`}
                      >
                        {STATUS_OPTIONS.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
