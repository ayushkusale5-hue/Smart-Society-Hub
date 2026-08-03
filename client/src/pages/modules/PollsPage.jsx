import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Vote, CheckCircle, Clock, Users, PieChart } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { pollService } from '../../services/poll.service';

export default function PollsPage() {
  const queryClient = useQueryClient();
  const [selectedOptions, setSelectedOptions] = useState({}); 

  const { data: res, isLoading } = useQuery({
    queryKey: ['polls'],
    queryFn: () => pollService.getPolls(),
  });

  const polls = res?.data || [];

  const { mutate: submitVote, isPending: isVoting } = useMutation({
    mutationFn: ({ id, optionIds }) => pollService.votePoll(id, optionIds),
    onSuccess: () => {
      toast.success('Vote recorded successfully!');
      queryClient.invalidateQueries(['polls']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to vote')
  });

  const handleVote = (pollId) => {
    const optionIds = selectedOptions[pollId];
    if (!optionIds || optionIds.length === 0) return toast.error('Please select an option');
    submitVote({ id: pollId, optionIds });
  };

  const handleSelect = (pollId, optionId, isMultipleChoice) => {
    setSelectedOptions(prev => {
      const current = prev[pollId] || [];
      if (isMultipleChoice) {
        return {
          ...prev,
          [pollId]: current.includes(optionId) ? current.filter(id => id !== optionId) : [...current, optionId]
        };
      } else {
        return { ...prev, [pollId]: [optionId] };
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-10">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Polls & Voting</h2>
        <p className="text-slate-500 mt-1">Participate in society decisions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        {isLoading ? (
          <div className="col-span-full py-20 text-center text-slate-500">Loading polls...</div>
        ) : polls.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Vote size={24} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No active polls</h3>
            <p className="text-slate-500">There are no polls currently available for voting.</p>
          </div>
        ) : (
          polls.map((poll, i) => {
            const isActive = poll.status === 'active' && (!poll.endsAt || new Date() < new Date(poll.endsAt));
            
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={poll._id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">{poll.question}</h3>
                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
                    isActive ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {isActive ? <Clock size={12} /> : <CheckCircle size={12} />}
                    {isActive ? 'Active' : 'Closed'}
                  </span>
                </div>
                
                {poll.description && (
                  <p className="text-sm text-slate-500 mb-6">{poll.description}</p>
                )}

                <div className="space-y-3 mb-6 flex-1">
                  {poll.options.map(opt => {
                    const isSelected = (selectedOptions[poll._id] || []).includes(opt._id);
                    const percentage = poll.totalVoters > 0 ? Math.round((opt.votes.length || opt.votes) / poll.totalVoters * 100) : 0;
                    
                    return (
                      <div 
                        key={opt._id}
                        onClick={() => !poll.hasVoted && isActive && handleSelect(poll._id, opt._id, poll.isMultipleChoice)}
                        className={`relative overflow-hidden border rounded-xl p-4 transition-all ${
                          !poll.hasVoted && isActive ? 'cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/50' : ''
                        } ${isSelected && !poll.hasVoted ? 'border-indigo-600 bg-indigo-50/30 shadow-sm' : 'border-slate-200'}
                        ${poll.hasVoted ? 'bg-slate-50' : ''}`}
                      >
                        {poll.hasVoted && (
                          <div 
                            className="absolute left-0 top-0 bottom-0 bg-indigo-100/50 transition-all duration-1000" 
                            style={{ width: `${percentage}%` }}
                          />
                        )}
                        <div className="relative flex items-center justify-between z-10">
                          <div className="flex items-center gap-3">
                            {!poll.hasVoted && isActive && (
                              <div className={`w-5 h-5 flex items-center justify-center rounded border ${poll.isMultipleChoice ? 'rounded-md' : 'rounded-full'} ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'}`}>
                                {isSelected && <CheckCircle size={14} />}
                              </div>
                            )}
                            <span className={`text-sm font-semibold ${isSelected && !poll.hasVoted ? 'text-indigo-900' : 'text-slate-700'}`}>
                              {opt.text}
                            </span>
                          </div>
                          {poll.hasVoted && (
                            <span className="text-sm font-bold text-slate-900">{percentage}%</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Users size={16} />
                    <span>{poll.totalVoters} votes</span>
                  </div>
                  
                  {!poll.hasVoted && isActive ? (
                    <button
                      onClick={() => handleVote(poll._id)}
                      disabled={isVoting || !(selectedOptions[poll._id]?.length > 0)}
                      className="btn btn-primary px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isVoting ? 'Submitting...' : 'Submit Vote'}
                    </button>
                  ) : poll.hasVoted ? (
                    <span className="text-sm font-bold text-green-600 flex items-center gap-1">
                      <CheckCircle size={16} /> Voted
                    </span>
                  ) : null}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
