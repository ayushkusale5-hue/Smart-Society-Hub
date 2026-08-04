import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, MapPin, Clock, Users, CheckCircle, XCircle } from 'lucide-react';
import { eventService } from '../../services/event.service';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

export default function EventsPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [filter, setFilter] = useState('upcoming');

  const { data: res, isLoading } = useQuery({
    queryKey: ['events', filter],
    queryFn: () => eventService.getAll(filter === 'upcoming' ? { upcoming: true } : {}),
  });
  const events = res?.data || [];

  const rsvpMutation = useMutation({
    mutationFn: ({ id, status }) => eventService.rsvp(id, { status }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['events'] }); toast.success('RSVP updated'); },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Society Events</h1>
          <p className="text-slate-500 text-sm mt-1">Discover and RSVP to upcoming events</p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-slate-100/80 p-1.5 rounded-2xl w-fit">
        <button onClick={() => setFilter('upcoming')} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${filter === 'upcoming' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Upcoming</button>
        <button onClick={() => setFilter('all')} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${filter === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>All Events</button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">{[1,2,3].map(i => <div key={i} className="h-64 bg-slate-100/50 rounded-2xl animate-pulse" />)}</div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/60 shadow-sm">
          <Calendar size={40} className="mx-auto mb-3 text-indigo-300" />
          <h3 className="text-lg font-bold text-slate-900 mb-1">No events</h3>
          <p className="text-slate-500 text-sm">Check back later for exciting community events.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((ev, i) => {
            const isPast = new Date(ev.date) < new Date(new Date().setHours(0,0,0,0));
            const myRsvp = ev.rsvps?.find(r => r.userId === String(user.id))?.status;
            const goingCount = ev.rsvps?.filter(r => r.status === 'Going').length || 0;
            const isFull = ev.maxAttendees > 0 && goingCount >= ev.maxAttendees;

            return (
              <motion.div key={ev._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className={`bg-white p-6 rounded-2xl border ${isPast ? 'border-slate-200/60 opacity-60' : 'border-indigo-100 shadow-sm hover:shadow-md'} transition-all flex flex-col`}>
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600">{ev.category}</span>
                  {myRsvp && (
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${myRsvp === 'Going' ? 'bg-green-100 text-green-700' : myRsvp === 'Maybe' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                      {myRsvp}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{ev.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4">{ev.description}</p>
                <div className="space-y-2 mb-4 mt-auto">
                  <div className="flex items-center gap-2 text-sm text-slate-600"><Calendar size={14} className="text-indigo-400" /> {new Date(ev.date).toLocaleDateString()}</div>
                  {ev.time && <div className="flex items-center gap-2 text-sm text-slate-600"><Clock size={14} className="text-amber-500" /> {ev.time}</div>}
                  {ev.venue && <div className="flex items-center gap-2 text-sm text-slate-600"><MapPin size={14} className="text-emerald-500" /> {ev.venue}</div>}
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Users size={16} className="text-blue-500" /> {goingCount} {ev.maxAttendees > 0 ? `/ ${ev.maxAttendees}` : ''} Going
                  </div>
                </div>

                {!isPast && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <button onClick={() => rsvpMutation.mutate({ id: ev._id, status: 'Going' })}
                      disabled={isFull && myRsvp !== 'Going'}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${myRsvp === 'Going' ? 'bg-green-50 border-green-200 text-green-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'} ${isFull && myRsvp !== 'Going' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <CheckCircle size={14} className="mx-auto mb-1" /> Going
                    </button>
                    <button onClick={() => rsvpMutation.mutate({ id: ev._id, status: 'Maybe' })}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${myRsvp === 'Maybe' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                      <Clock size={14} className="mx-auto mb-1" /> Maybe
                    </button>
                    <button onClick={() => rsvpMutation.mutate({ id: ev._id, status: 'Not Going' })}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${myRsvp === 'Not Going' ? 'bg-red-50 border-red-200 text-red-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                      <XCircle size={14} className="mx-auto mb-1" /> No
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
