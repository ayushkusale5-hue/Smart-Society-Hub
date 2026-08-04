import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, X, QrCode, User, Phone, Car, Calendar, Clock, CheckCircle2,
  LogIn, LogOut, XCircle, ChevronDown,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { visitorService } from '../../services/visitor.service';
import QRCode from 'qrcode';
import { useEffect, useRef } from 'react';

const PURPOSES = ['Guest', 'Delivery', 'Service', 'Other'];
const PASS_TYPES = [
  { value: 'single', label: 'Single Visit' },
  { value: 'recurring', label: 'Recurring' },
  { value: 'temporary', label: 'Temporary Pass' },
];

const STATUS_CONFIG = {
  Expected: { color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', icon: Clock, label: 'Expected' },
  Inside: { color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0', icon: LogIn, label: 'Inside' },
  Exited: { color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb', icon: LogOut, label: 'Exited' },
  Denied: { color: '#ef4444', bg: '#fef2f2', border: '#fecaca', icon: XCircle, label: 'Denied' },
};

function QRCanvas({ qrCode }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (canvasRef.current && qrCode) {
      const qrPayload = `SSH-PASS:${qrCode}`;
      QRCode.toCanvas(canvasRef.current, qrPayload, {
        width: 180,
        margin: 2,
        color: { dark: '#0f172a', light: '#ffffff' },
      }).catch(() => {});
    }
  }, [qrCode]);
  return <canvas ref={canvasRef} />;
}

export default function VisitorPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedVisitor, setSelectedVisitor] = useState(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ['my-visitors', filterStatus],
    queryFn: () => visitorService.getMyVisitors(filterStatus ? { status: filterStatus } : {}),
  });

  const visitors = response?.data?.visitors || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Visitor Passes</h1>
          <p className="text-slate-500 text-sm mt-1">Invite guests and generate secure QR passes</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary shadow-lg shadow-indigo-200">
          <Plus size={18} /> Invite Visitor
        </button>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-100/80 p-1.5 rounded-2xl w-fit mb-4">
        {[{ label: 'All', value: '' }, ...Object.entries(STATUS_CONFIG).map(([k, v]) => ({ label: v.label, value: k }))].map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilterStatus(value)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${filterStatus === value ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Visitors grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-52 bg-slate-100/60 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : visitors.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/60 shadow-sm">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User size={28} className="text-indigo-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No visitors yet</h3>
          <p className="text-slate-500 text-sm mb-5">Invite your first visitor to generate a QR pass.</p>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
            <Plus size={16} /> Invite Visitor
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <AnimatePresence>
            {visitors.map((visitor) => {
              const cfg = STATUS_CONFIG[visitor.status] || STATUS_CONFIG.Expected;
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={visitor._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-3xl border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
                  style={{ borderColor: cfg.border }}
                  onClick={() => setSelectedVisitor(visitor)}
                >
                  {/* Status strip */}
                  <div className="h-1.5" style={{ background: cfg.color }} />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg leading-tight">{visitor.name}</h3>
                        <p className="text-slate-500 text-sm flex items-center gap-1.5 mt-1">
                          <Phone size={12} /> {visitor.phone}
                        </p>
                      </div>
                      <span
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0"
                        style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
                      >
                        <Icon size={11} /> {cfg.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Car size={12} /> {visitor.purpose}
                      </span>
                      {visitor.vehicleNumber && (
                        <span className="font-mono bg-slate-100 px-2 py-0.5 rounded-lg">{visitor.vehicleNumber}</span>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar size={11} />
                        {visitor.expectedArrival
                          ? format(new Date(visitor.expectedArrival), 'MMM d, h:mm a')
                          : format(new Date(visitor.createdAt), 'MMM d')}
                      </span>
                      <div className="flex items-center gap-3">
                        {visitor.status === 'Expected' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm('Are you sure you want to cancel this visitor pass?')) {
                                visitorService.deleteVisitor(visitor._id)
                                  .then(() => toast.success('Pass canceled'))
                                  .catch((err) => toast.error(err.response?.data?.message || 'Failed to cancel pass'))
                                  .finally(() => queryClient.invalidateQueries(['my-visitors']));
                              }
                            }}
                            className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedVisitor(visitor); }}
                          className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                          <QrCode size={14} /> Show Pass
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Invite Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <InviteModal
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => {
              setIsModalOpen(false);
              queryClient.invalidateQueries(['my-visitors']);
              toast.success('Visitor invited! QR pass generated.');
            }}
          />
        )}
      </AnimatePresence>

      {/* QR Pass Drawer */}
      <AnimatePresence>
        {selectedVisitor && (
          <QRPassDrawer visitor={selectedVisitor} onClose={() => setSelectedVisitor(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}


function InviteModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    purpose: 'Guest',
    vehicleNumber: '',
    expectedArrival: '',
    passType: 'single',
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => visitorService.inviteVisitor(data),
    onSuccess,
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to invite visitor'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) return toast.error('Name and phone are required');
    mutate(form);
  };

  return (
    <div className="modal-backdrop">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.95 }}
        className="modal-content"
      >
        <div className="modal-header">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Invite Visitor</h2>
            <p className="text-sm text-slate-500 mt-0.5">A QR pass will be generated automatically</p>
          </div>
          <button onClick={onClose} className="modal-close">
            <X size={16} />
          </button>
        </div>

        <form id="inviteForm" onSubmit={handleSubmit} className="modal-body overflow-y-auto space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="form-group">
              <label className="label">Visitor Name <span className="text-red-500">*</span></label>
              <input className="input" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="label">Phone <span className="text-red-500">*</span></label>
              <input className="input" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="form-group">
              <label className="label">Purpose</label>
              <select className="input" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })}>
                {PURPOSES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="label">Pass Type</label>
              <select className="input" value={form.passType} onChange={(e) => setForm({ ...form, passType: e.target.value })}>
                {PASS_TYPES.map((pt) => <option key={pt.value} value={pt.value}>{pt.label}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="label">Vehicle Number (optional)</label>
            <input className="input font-mono" placeholder="MH 12 AB 1234" value={form.vehicleNumber} onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="label">Expected Arrival (optional)</label>
            <input type="datetime-local" className="input" value={form.expectedArrival} onChange={(e) => setForm({ ...form, expectedArrival: e.target.value })} />
          </div>
        </form>

        <div className="modal-footer">
          <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
          <button type="submit" form="inviteForm" disabled={isPending} className="btn btn-primary">
            {isPending ? 'Generating Pass...' : '✓ Generate QR Pass'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}


function QRPassDrawer({ visitor, onClose }) {
  const cfg = STATUS_CONFIG[visitor.status] || STATUS_CONFIG.Expected;
  const Icon = cfg.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 60 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-[calc(100vw-32px)] sm:max-w-sm overflow-hidden"
      >
        {/* Pass Header */}
        <div className="p-6 text-center" style={{ background: `linear-gradient(135deg, #0f172a 0%, #1e293b 100%)` }}>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Smart Society Hub</div>
          <div className="text-white font-bold text-lg">Visitor Pass</div>
        </div>

        {/* QR */}
        <div className="flex justify-center py-6 bg-white">
          {visitor.qrCode ? (
            <QRCanvas qrCode={visitor.qrCode} />
          ) : (
            <div className="w-44 h-44 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
              <QrCode size={48} />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="px-6 pb-4 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-500 text-sm whitespace-nowrap flex-shrink-0">Name</span>
            <span className="font-bold text-slate-900 truncate text-right">{visitor.name}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-500 text-sm whitespace-nowrap flex-shrink-0">Purpose</span>
            <span className="font-semibold text-slate-700 truncate text-right">{visitor.purpose}</span>
          </div>
          {visitor.expectedArrival && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-sm">Expected</span>
              <span className="font-semibold text-slate-700">{format(new Date(visitor.expectedArrival), 'MMM d, h:mm a')}</span>
            </div>
          )}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-slate-500 text-sm">Status</span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: cfg.bg, color: cfg.color }}>
              <Icon size={11} /> {cfg.label}
            </span>
          </div>
        </div>

        <div className="p-5 border-t border-slate-100">
          <button onClick={onClose} className="btn btn-ghost w-full">Close</button>
        </div>
      </motion.div>
    </div>
  );
}
