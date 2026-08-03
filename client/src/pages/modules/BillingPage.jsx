import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, Clock, AlertCircle, IndianRupee, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { billingService } from '../../services/billing.service';

const statusColors = {
  Pending: { bg: '#fef3c7', text: '#d97706', icon: Clock },
  Paid: { bg: '#dcfce7', text: '#15803d', icon: CheckCircle },
  Overdue: { bg: '#fee2e2', text: '#b91c1c', icon: AlertCircle },
};

export default function BillingPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState(''); 

  const { data: res, isLoading } = useQuery({
    queryKey: ['my-bills', filter],
    queryFn: () => billingService.getBills(filter ? { status: filter } : {}),
  });

  const bills = res?.data || [];

  const { mutate: payBill, isPending: isPaying } = useMutation({
    mutationFn: (id) => billingService.payBill(id),
    onSuccess: () => {
      toast.success('Payment successful! 🎉');
      queryClient.invalidateQueries(['my-bills']);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Payment failed');
    }
  });

  const handlePay = (id) => {
    
    
    payBill(id);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">My Maintenance Bills</h2>
          <p className="text-slate-500 mt-1">View and pay your society maintenance dues</p>
        </div>
        <div className="flex gap-2">
          {['', 'Pending', 'Paid', 'Overdue'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                filter === f
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f || 'All'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
        {isLoading ? (
          <div className="col-span-full py-20 text-center text-slate-500">Loading bills...</div>
        ) : bills.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={24} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No bills found</h3>
            <p className="text-slate-500">You are all caught up!</p>
          </div>
        ) : (
          bills.map((bill, i) => {
            const StatusIcon = statusColors[bill.status].icon;
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={bill._id}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full" style={{ background: statusColors[bill.status].text }} />
                
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{bill.month}</h3>
                    <p className="text-sm text-slate-500 mt-1">{bill.type}</p>
                  </div>
                  <span
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: statusColors[bill.status].bg, color: statusColors[bill.status].text }}
                  >
                    <StatusIcon size={12} />
                    {bill.status}
                  </span>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <IndianRupee size={18} className="text-slate-400" />
                    <span className="text-3xl font-black text-slate-900 tracking-tight">{bill.amount.toLocaleString()}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-500 mt-2">
                    Due: <span className={bill.status === 'Overdue' ? 'text-red-500' : 'text-slate-700'}>{new Date(bill.dueDate).toLocaleDateString()}</span>
                  </p>
                </div>

                <div className="flex gap-3">
                  {bill.status === 'Pending' || bill.status === 'Overdue' ? (
                    <button
                      onClick={() => handlePay(bill._id)}
                      disabled={isPaying}
                      className="btn btn-primary flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-colors"
                    >
                      {isPaying ? 'Processing...' : 'Pay Now'}
                    </button>
                  ) : (
                    <div className="flex-1 py-3 bg-slate-50 rounded-xl font-bold text-slate-500 text-center flex items-center justify-center gap-2">
                      <CheckCircle size={16} className="text-green-500" />
                      Paid on {new Date(bill.paidAt).toLocaleDateString()}
                    </div>
                  )}
                  <button className="w-12 h-12 flex items-center justify-center bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors">
                    <Download size={18} />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
