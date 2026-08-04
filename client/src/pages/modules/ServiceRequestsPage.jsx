import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, AlertCircle, Phone, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

// Mock data for Phase 2 vendor open requests
const MOCK_REQUESTS = [
  { id: 1, title: 'Annual AC Servicing for Block A', category: 'Appliance Repair', date: '2023-11-15', desc: 'Need complete servicing for 15 AC units in Block A lobby and gym area.', budget: '$450', status: 'Open' },
  { id: 2, title: 'Deep Cleaning of Swimming Pool', category: 'Cleaning', date: '2023-11-18', desc: 'Pre-winter deep cleaning required for the main pool and kids pool.', budget: '$200', status: 'Open' },
  { id: 3, title: 'Repair Main Gate Motor', category: 'Electrical', date: '2023-11-20', desc: 'The sliding gate motor is making a grinding noise and needs urgent repair.', budget: 'Quote required', status: 'Urgent' },
];

export default function ServiceRequestsPage() {
  const [requests, setRequests] = useState(MOCK_REQUESTS);

  const handleApply = (id) => {
    toast.success('Interest sent to committee!');
    setRequests(requests.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Service Requests</h1>
          <p className="text-slate-500 text-sm mt-1">Available jobs posted by the society</p>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/60 shadow-sm">
          <Briefcase size={40} className="mx-auto mb-3 text-indigo-300" />
          <h3 className="text-lg font-bold text-slate-900 mb-1">No open requests</h3>
          <p className="text-slate-500 text-sm">Check back later for new opportunities.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {requests.map((req, i) => (
            <motion.div key={req.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600">{req.category}</span>
                {req.status === 'Urgent' && <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 flex items-center gap-1"><AlertCircle size={12}/> Urgent</span>}
              </div>
              <h3 className="font-bold text-slate-900 mb-1">{req.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mb-4">{req.desc}</p>
              
              <div className="bg-slate-50 p-3 rounded-xl mb-4 text-sm flex justify-between items-center">
                <span className="text-slate-500">Est. Budget</span>
                <span className="font-bold text-slate-900">{req.budget}</span>
              </div>
              
              <button onClick={() => handleApply(req.id)} className="w-full mt-auto py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
                Apply for Job <ArrowRight size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
