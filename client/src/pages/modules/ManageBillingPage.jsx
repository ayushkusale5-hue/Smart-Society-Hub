import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, X, Search, Filter, IndianRupee, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { billingService } from '../../services/billing.service';

export default function ManageBillingPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('');
  
  const [form, setForm] = useState({
    month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
    amount: '',
    dueDate: ''
  });

  const { data: res, isLoading } = useQuery({
    queryKey: ['all-bills', filter],
    queryFn: () => billingService.getBills(filter ? { status: filter } : {}),
  });

  const bills = res?.data || [];

  const { mutate: generateBills, isPending: isGenerating } = useMutation({
    mutationFn: (data) => billingService.generateBulkBills(data),
    onSuccess: (res) => {
      toast.success(res.message || 'Bills generated successfully');
      setIsModalOpen(false);
      queryClient.invalidateQueries(['all-bills']);
      setForm({ ...form, amount: '', dueDate: '' });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to generate bills')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.month || !form.amount || !form.dueDate) return toast.error('All fields are required');
    generateBills(form);
  };

  const totalCollected = bills.filter(b => b.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0);
  const totalPending = bills.filter(b => b.status === 'Pending' || b.status === 'Overdue').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Maintenance Billing</h1>
          <p className="text-sm text-slate-500 mt-1">Manage society dues and track payments</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200">
          <Plus size={18} /> Generate Bills
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Total Collected</p>
          <div className="flex items-center gap-1 text-3xl font-black text-slate-900">
            <IndianRupee size={24} className="text-green-500" />
            {totalCollected.toLocaleString()}
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Total Pending</p>
          <div className="flex items-center gap-1 text-3xl font-black text-slate-900">
            <IndianRupee size={24} className="text-orange-500" />
            {totalPending.toLocaleString()}
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Total Invoices</p>
            <div className="text-3xl font-black text-slate-900">{bills.length}</div>
          </div>
          <FileText size={40} className="text-indigo-100" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search resident..." className="input pl-10 bg-slate-50 border-transparent focus:bg-white w-full" />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 no-scrollbar whitespace-nowrap">
            {['', 'Pending', 'Paid', 'Overdue'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                  filter === f ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}>
                {f || 'All'}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-bold border-b border-slate-100">Resident</th>
                <th className="p-4 font-bold border-b border-slate-100">Month</th>
                <th className="p-4 font-bold border-b border-slate-100">Amount</th>
                <th className="p-4 font-bold border-b border-slate-100">Due Date</th>
                <th className="p-4 font-bold border-b border-slate-100">Status</th>
                <th className="p-4 font-bold border-b border-slate-100 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {isLoading ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">Loading bills...</td></tr>
              ) : bills.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">No billing records found.</td></tr>
              ) : (
                bills.map((bill) => (
                  <tr key={bill._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{bill.resident.first_name} {bill.resident.last_name}</div>
                      <div className="text-xs text-slate-500">Flat {bill.resident.flat_number}, {bill.resident.tower}</div>
                    </td>
                    <td className="p-4 font-semibold text-slate-700">{bill.month}</td>
                    <td className="p-4 font-black text-slate-900">₹{bill.amount.toLocaleString()}</td>
                    <td className="p-4 text-slate-600">{new Date(bill.dueDate).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        bill.status === 'Paid' ? 'bg-green-100 text-green-700' :
                        bill.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {bill.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {bill.status !== 'Paid' && (
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this bill?')) {
                              billingService.deleteBill(bill.id)
                                .then(() => toast.success('Bill deleted'))
                                .catch(err => toast.error(err.response?.data?.message || 'Failed to delete'))
                                .finally(() => queryClient.invalidateQueries(['all-bills']));
                            }
                          }}
                          className="text-red-500 hover:text-red-700 font-bold bg-red-50 px-2 py-1.5 rounded-lg transition-colors text-xs"
                          title="Delete Bill"
                        >
                          Delete
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
        {isModalOpen && (
          <div className="modal-backdrop">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="modal-content">
              <div className="modal-header">
                <h2>Generate Bills</h2>
                <button onClick={() => setIsModalOpen(false)} className="modal-close">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="modal-body pb-6">
                <div className="bg-blue-50 text-blue-800 p-4 rounded-xl flex gap-3 text-sm font-medium">
                  <AlertCircle className="shrink-0" size={18} />
                  This will generate a maintenance bill for all active residents.
                </div>
                
                <div className="form-group">
                  <label className="label">Billing Month</label>
                  <input className="input" value={form.month} onChange={e => setForm({...form, month: e.target.value})} placeholder="e.g. July 2026" />
                </div>
                <div className="form-group">
                  <label className="label">Amount (₹)</label>
                  <input type="number" className="input" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="e.g. 2500" />
                </div>
                <div className="form-group">
                  <label className="label">Due Date</label>
                  <input type="date" className="input" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} />
                </div>
                <div className="mt-2">
                  <button type="submit" disabled={isGenerating} className="btn btn-primary w-full py-3.5">
                    {isGenerating ? 'Generating...' : 'Generate for All Residents'}
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
