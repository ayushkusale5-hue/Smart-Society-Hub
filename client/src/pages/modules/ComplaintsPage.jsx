import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, X, UploadCloud, AlertCircle, Clock, CheckCircle, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { complaintService } from '../../services/complaint.service';
import { format } from 'date-fns';

const CATEGORIES = ['Plumbing', 'Electrical', 'Carpentry', 'Cleaning', 'Security', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

const STATUS_COLORS = {
  'Pending': 'bg-amber-100 text-amber-800 border-amber-200',
  'Assigned': 'bg-blue-100 text-blue-800 border-blue-200',
  'In Progress': 'bg-purple-100 text-purple-800 border-purple-200',
  'Resolved': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Closed': 'bg-slate-100 text-slate-800 border-slate-200',
};

const PRIORITY_COLORS = {
  'Low': 'text-slate-500 bg-slate-100',
  'Medium': 'text-blue-600 bg-blue-100',
  'High': 'text-orange-600 bg-orange-100',
  'Urgent': 'text-red-600 bg-red-100',
};

export default function ComplaintsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  
  // Fetch Complaints
  const { data: response, isLoading } = useQuery({
    queryKey: ['complaints', filterStatus],
    queryFn: () => complaintService.getComplaints(filterStatus ? { status: filterStatus } : {}),
  });

  const complaints = response?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Complaints</h1>
          <p className="text-slate-500 text-sm mt-1">Track and manage your maintenance requests</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary shadow-lg shadow-indigo-200"
        >
          <Plus size={20} /> Raise Complaint
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
        <button 
          onClick={() => setFilterStatus('')}
          className={`px-5 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${!filterStatus ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/60 shadow-sm hover:border-slate-300 hover:shadow'}`}
        >
          All Requests
        </button>
        {Object.keys(STATUS_COLORS).map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-5 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${filterStatus === status ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/60 shadow-sm hover:border-slate-300 hover:shadow'}`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Complaints Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-64 bg-slate-100/50 rounded-3xl animate-pulse border border-slate-200/50" />)}
        </div>
      ) : complaints.length === 0 ? (
        <div className="text-center py-24 bg-gradient-to-b from-white to-slate-50/50 rounded-[2rem] border border-slate-200/60 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.05)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-20"></div>
          <div className="w-20 h-20 bg-indigo-50/80 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-indigo-100/50 transform rotate-3">
            <CheckCircle size={32} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">No complaints found</h3>
          <p className="text-slate-500 font-medium">You don't have any active complaints right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {complaints.map(complaint => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={complaint._id} 
              className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-lg shadow-slate-200/40 hover:shadow-xl hover:shadow-indigo-900/5 hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[complaint.status]}`}>
                  {complaint.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${PRIORITY_COLORS[complaint.priority]}`}>
                  {complaint.priority}
                </span>
              </div>
              
              <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-1">{complaint.title}</h3>
              <p className="text-slate-500 text-sm mb-6 line-clamp-2 flex-grow">{complaint.description}</p>
              
              {complaint.images?.length > 0 && (
                <div className="flex gap-2 mb-6">
                  {complaint.images.slice(0, 3).map((img, idx) => (
                    <div key={idx} className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                      <img src={import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') + img : `http://localhost:5000${img}`} alt="evidence" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {complaint.images.length > 3 && (
                    <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-500 border border-slate-200">
                      +{complaint.images.length - 3}
                    </div>
                  )}
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg">
                  <AlertCircle size={14} className="text-slate-400" />
                  {complaint.category}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={14} className="text-slate-400" />
                  {format(new Date(complaint.createdAt), 'MMM d, h:mm a')}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <CreateComplaintModal 
            onClose={() => setIsModalOpen(false)} 
            onSuccess={() => {
              setIsModalOpen(false);
              queryClient.invalidateQueries(['complaints']);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CreateComplaintModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Plumbing',
    priority: 'Medium',
  });
  const [files, setFiles] = useState([]);

  const { mutate: submitComplaint, isPending } = useMutation({
    mutationFn: (data) => complaintService.createComplaint(data),
    onSuccess: () => {
      toast.success('Complaint raised successfully!');
      onSuccess();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to raise complaint');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return toast.error('Please fill all required fields');
    
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    files.forEach(file => data.append('images', file));
    
    submitComplaint(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-900">Raise New Complaint</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="complaintForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label">Title <span className="text-red-500">*</span></label>
              <input type="text" 
                className="input" 
                placeholder="E.g. Leaking pipe in bathroom"
                value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 form-group">
              <div>
                <label className="label">Category</label>
                <select 
                  className="input appearance-none font-medium cursor-pointer"
                  value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Priority</label>
                <select 
                  className="input appearance-none font-medium cursor-pointer"
                  value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}
                >
                  {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="label">Description <span className="text-red-500">*</span></label>
              <textarea 
                className="input min-h-[140px] resize-none" 
                placeholder="Describe the issue in detail..."
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required
              />
            </div>

            <div className="form-group mb-0">
              <label className="label">Attach Photos (Optional)</label>
              <div className="border-2 border-dashed border-[#e8ecf4] rounded-[14px] p-8 text-center hover:bg-[#f8fafc] transition-colors relative flex flex-col items-center justify-center cursor-pointer">
                <input 
                  type="file" multiple accept="image/*" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={e => setFiles(Array.from(e.target.files))}
                />
                <UploadCloud className="text-slate-400 mb-2 block" size={32} />
                <p className="text-sm font-medium text-slate-700">Click or drag images to upload</p>
                <p className="text-xs text-slate-400 mt-1">Max 5 images. JPEG, PNG only.</p>
              </div>
              {files.length > 0 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                  {files.map((f, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-lg bg-slate-100 flex-shrink-0 border border-slate-200 overflow-hidden">
                      <img src={URL.createObjectURL(f)} className="w-full h-full object-cover" alt="preview" />
                      <button type="button" onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white flex items-center justify-center rounded-full text-xs">
                        <X size={12}/>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-[#e8ecf4] bg-[#f4f6fb] flex justify-end items-center gap-4 rounded-b-3xl">
          <button type="button" onClick={onClose} className="btn btn-ghost">
            Cancel
          </button>
          <button type="submit" form="complaintForm" disabled={isPending} className="btn btn-primary">
            {isPending ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
