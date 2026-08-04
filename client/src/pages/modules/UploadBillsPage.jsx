import { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UploadBillsPage() {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([
    { id: 1, name: 'Oct_Painting_Invoice.pdf', amount: '$450', status: 'Paid', date: '2023-10-20' },
  ]);

  const handleUpload = () => {
    if (!file) return toast.error('Please select a file');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Bill uploaded successfully');
      setHistory([{ id: Date.now(), name: file.name, amount: 'Pending', status: 'Processing', date: new Date().toLocaleDateString() }, ...history]);
      setFile(null);
      setDesc('');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Upload Bills</h1>
        <p className="text-slate-500 text-sm mt-1">Submit your invoices for completed jobs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-4">Submit New Invoice</h2>
          
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center mb-4">
            <UploadCloud size={40} className="mx-auto mb-3 text-indigo-300" />
            <p className="text-sm font-bold text-slate-700 mb-1">Click or drag file to upload</p>
            <p className="text-xs text-slate-400 mb-4">PDF, JPG, PNG (Max 5MB)</p>
            <input type="file" id="billFile" className="hidden" onChange={e => setFile(e.target.files[0])} />
            <label htmlFor="billFile" className="btn btn-secondary cursor-pointer">Select File</label>
            {file && <div className="mt-3 text-sm text-indigo-600 font-bold">{file.name}</div>}
          </div>
          
          <div className="form-group mb-4">
            <label className="label">Description / Job Reference</label>
            <input className="input" value={desc} onChange={e => setDesc(e.target.value)} placeholder="e.g. Invoice for Lobby Painting" />
          </div>

          <button onClick={handleUpload} disabled={loading || !file} className="btn btn-primary w-full">
            {loading ? 'Uploading...' : 'Submit Bill'}
          </button>
        </motion.div>

        {/* Upload History */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-4">Submission History</h2>
          
          <div className="space-y-3">
            {history.map(item => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                    <FileText size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900">{item.name}</div>
                    <div className="text-xs text-slate-500">{item.date} • {item.amount}</div>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${item.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
