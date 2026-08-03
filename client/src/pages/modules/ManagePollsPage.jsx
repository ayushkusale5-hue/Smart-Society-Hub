import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Vote, Plus, X, Users, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { pollService } from '../../services/poll.service';

export default function ManagePollsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    question: '',
    description: '',
    options: ['', ''],
    endsAt: '',
    isAnonymous: false,
    isMultipleChoice: false
  });

  const { data: res, isLoading } = useQuery({
    queryKey: ['polls'],
    queryFn: () => pollService.getPolls(),
  });

  const polls = res?.data || [];

  const { mutate: createPoll, isPending } = useMutation({
    mutationFn: (data) => pollService.createPoll(data),
    onSuccess: () => {
      toast.success('Poll created successfully');
      setIsModalOpen(false);
      queryClient.invalidateQueries(['polls']);
      setForm({
        question: '', description: '', options: ['', ''], endsAt: '', isAnonymous: false, isMultipleChoice: false
      });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create poll')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const validOptions = form.options.filter(o => o.trim() !== '');
    if (!form.question) return toast.error('Question is required');
    if (validOptions.length < 2) return toast.error('Provide at least two options');
    createPoll({ ...form, options: validOptions });
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Manage Polls</h1>
          <p className="text-sm text-slate-500 mt-1">Create and monitor society polls and surveys</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200">
          <Plus size={18} /> Create Poll
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-20 text-center text-slate-500">Loading polls...</div>
        ) : polls.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Vote size={24} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No Polls Created</h3>
            <p className="text-slate-500">Create a poll to gather opinions from residents.</p>
          </div>
        ) : (
          polls.map((poll) => {
            const isActive = poll.status === 'active' && (!poll.endsAt || new Date() < new Date(poll.endsAt));
            return (
              <div key={poll._id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-slate-900 leading-snug">{poll.question}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-bold shrink-0 ${isActive ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                    {isActive ? 'Active' : 'Closed'}
                  </span>
                </div>
                
                <div className="space-y-2 mb-6 flex-1">
                  {poll.options.map(opt => {
                    const percentage = poll.totalVoters > 0 ? Math.round((opt.votes.length || opt.votes) / poll.totalVoters * 100) : 0;
                    return (
                      <div key={opt._id} className="relative overflow-hidden bg-slate-50 border border-slate-100 rounded-lg p-3">
                        <div className="absolute left-0 top-0 bottom-0 bg-indigo-100/60" style={{ width: `${percentage}%` }} />
                        <div className="relative flex justify-between text-sm z-10">
                          <span className="font-medium text-slate-700">{opt.text}</span>
                          <span className="font-bold text-slate-900">{percentage}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-sm text-slate-500 border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-1.5"><Users size={14} /> {poll.totalVoters} votes</div>
                  <div className="flex items-center gap-3">
                    {poll.endsAt && (
                      <div className="flex items-center gap-1.5"><Clock size={14} /> Ends {new Date(poll.endsAt).toLocaleDateString()}</div>
                    )}
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this poll?')) {
                          pollService.deletePoll(poll._id)
                            .then(() => toast.success('Poll deleted'))
                            .catch(err => toast.error('Failed to delete poll'))
                            .finally(() => queryClient.invalidateQueries(['polls']));
                        }
                      }}
                      className="text-red-500 hover:text-red-700 transition-colors bg-red-50 p-1.5 rounded-lg"
                      title="Delete Poll"
                    >
                      <X size={16} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-backdrop">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="modal-content">
              <div className="modal-header">
                <h2>Create New Poll</h2>
                <button onClick={() => setIsModalOpen(false)} className="modal-close">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="modal-body pb-6">
                <div className="form-group">
                  <label className="label">Question <span className="text-red-500">*</span></label>
                  <input className="input" required value={form.question} onChange={e => setForm({...form, question: e.target.value})} placeholder="What should we name the new clubhouse?" />
                </div>
                
                <div className="form-group">
                  <label className="label">Description (Optional)</label>
                  <textarea className="input" rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Provide some context..." />
                </div>

                <div className="form-group">
                  <label className="label mb-2">Options <span className="text-red-500">*</span></label>
                  {form.options.map((opt, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input className="input flex-1" value={opt} onChange={e => {
                        const newOpts = [...form.options];
                        newOpts[i] = e.target.value;
                        setForm({...form, options: newOpts});
                      }} placeholder={`Option ${i+1}`} />
                      {form.options.length > 2 && (
                        <button type="button" onClick={() => {
                          const newOpts = form.options.filter((_, idx) => idx !== i);
                          setForm({...form, options: newOpts});
                        }} className="btn btn-secondary px-3 text-red-500"><X size={16} /></button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => setForm({...form, options: [...form.options, '']})} className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 mt-2">
                    <Plus size={14} /> Add Option
                  </button>
                </div>

                <div className="form-group">
                  <label className="label">Ends At (Optional)</label>
                  <input type="datetime-local" className="input" value={form.endsAt} onChange={e => setForm({...form, endsAt: e.target.value})} />
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <label className="checkbox-label">
                    <input type="checkbox" checked={form.isAnonymous} onChange={e => setForm({...form, isAnonymous: e.target.checked})} className="checkbox-input" />
                    Anonymous Voting (Voters' identities are hidden)
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" checked={form.isMultipleChoice} onChange={e => setForm({...form, isMultipleChoice: e.target.checked})} className="checkbox-input" />
                    Allow Multiple Choices
                  </label>
                </div>

                <div className="mt-2">
                  <button type="submit" disabled={isPending} className="btn btn-primary w-full py-3.5">
                    {isPending ? 'Publishing...' : 'Publish Poll'}
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
