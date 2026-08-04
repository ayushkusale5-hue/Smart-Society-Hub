import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCode, Search, LogIn, LogOut, XCircle, Clock,
  User, Phone, Car, CheckCircle2, AlertTriangle, RefreshCw,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { visitorService } from '../../services/visitor.service';
import QRCode from 'qrcode';

const STATUS_CONFIG = {
  Expected: { color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', icon: Clock },
  Inside: { color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0', icon: LogIn },
  Exited: { color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb', icon: LogOut },
  Denied: { color: '#ef4444', bg: '#fef2f2', border: '#fecaca', icon: XCircle },
};

function QRCanvas({ qrCode }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (canvasRef.current && qrCode) {
      QRCode.toCanvas(canvasRef.current, qrCode, { width: 140, margin: 2 }).catch(() => {});
    }
  }, [qrCode]);
  return <canvas ref={canvasRef} />;
}

export default function VisitorGatePage() {
  const queryClient = useQueryClient();
  const [qrInput, setQrInput] = useState('');
  const [scannedVisitor, setScannedVisitor] = useState(null);
  const [scanLoading, setScanLoading] = useState(false);

  
  const { data: expectedRes, isLoading, refetch } = useQuery({
    queryKey: ['expected-visitors'],
    queryFn: () => visitorService.getExpectedVisitors(),
    refetchInterval: 30000, 
  });
  const expectedVisitors = expectedRes?.data || [];

  
  const { mutate: markEntry } = useMutation({
    mutationFn: (id) => visitorService.markEntry(id),
    onSuccess: (res) => {
      toast.success(`${res.data?.name || 'Visitor'} entry marked ✅`);
      queryClient.invalidateQueries(['expected-visitors']);
      setScannedVisitor(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to mark entry'),
  });

  
  const { mutate: markExit } = useMutation({
    mutationFn: (id) => visitorService.markExit(id),
    onSuccess: (res) => {
      toast.success(`${res.data?.name || 'Visitor'} exit marked ✅`);
      queryClient.invalidateQueries(['expected-visitors']);
      setScannedVisitor(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to mark exit'),
  });

  
  const { mutate: denyVisitor } = useMutation({
    mutationFn: (id) => visitorService.denyVisitor(id),
    onSuccess: () => {
      toast.success('Visitor denied');
      queryClient.invalidateQueries(['expected-visitors']);
      setScannedVisitor(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const handleScanQR = async () => {
    if (!qrInput.trim()) return toast.error('Enter a QR code');
    setScanLoading(true);
    try {
      const parsedCode = qrInput.replace(/^SSH-PASS:/, '').trim();
      const res = await visitorService.scanQR(parsedCode);
      setScannedVisitor(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'QR code not found');
    } finally {
      setScanLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Visitor Gate</h1>
          <p className="text-slate-500 text-sm mt-1">Verify visitor entry and exit</p>
        </div>
        <button onClick={() => refetch()} className="btn btn-ghost flex items-center gap-2">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
            <QrCode size={20} />
          </div>
          <div>
            <div className="font-bold">Scan QR Pass</div>
            <div className="text-blue-200 text-sm">Enter the visitor's QR code</div>
          </div>
        </div>
        <div className="flex gap-3">
          <input
            className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-4 py-2.5 text-white placeholder-blue-300 text-sm focus:outline-none focus:bg-white/20"
            placeholder="Paste or type QR code..."
            value={qrInput}
            onChange={(e) => setQrInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleScanQR()}
          />
          <button
            onClick={handleScanQR}
            disabled={scanLoading}
            className="px-5 py-2.5 bg-white text-blue-700 rounded-2xl font-bold text-sm hover:bg-blue-50 transition-colors shadow-lg"
          >
            {scanLoading ? '...' : <Search size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {scannedVisitor && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="bg-white rounded-3xl border border-emerald-200 shadow-xl shadow-emerald-50 overflow-hidden"
          >
            <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex items-center justify-between">
              <span className="font-bold text-emerald-800 flex items-center gap-2"><CheckCircle2 size={18} /> Visitor Found</span>
              <button onClick={() => setScannedVisitor(null)} className="text-slate-400 hover:text-slate-600 transition-colors"><XCircle size={18} /></button>
            </div>
            <div className="p-6 flex flex-col sm:flex-row gap-6 items-start">
              <div className="flex-shrink-0">
                {scannedVisitor.qrCode && <QRCanvas qrCode={scannedVisitor.qrCode} />}
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{scannedVisitor.name}</h3>
                  {scannedVisitor.host && (
                    <p className="text-sm text-slate-500 mt-1">
                      Host: <span className="font-semibold text-slate-700">{scannedVisitor.host.name}</span>
                      {scannedVisitor.host.flatNumber && ` · Flat ${scannedVisitor.host.tower || ''}${scannedVisitor.host.flatNumber}`}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-slate-400">Phone</span><div className="font-semibold text-slate-800">{scannedVisitor.phone}</div></div>
                  <div><span className="text-slate-400">Purpose</span><div className="font-semibold text-slate-800">{scannedVisitor.purpose}</div></div>
                  {scannedVisitor.vehicleNumber && (
                    <div><span className="text-slate-400">Vehicle</span><div className="font-mono font-semibold text-slate-800">{scannedVisitor.vehicleNumber}</div></div>
                  )}
                  <div>
                    <span className="text-slate-400">Status</span>
                    <div className="mt-0.5">
                      <StatusBadge status={scannedVisitor.status} />
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 pt-2 flex-wrap">
                  {scannedVisitor.status === 'Expected' && (
                    <button onClick={() => markEntry(scannedVisitor._id)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors shadow-sm">
                      <LogIn size={15} /> Allow Entry
                    </button>
                  )}
                  {scannedVisitor.status === 'Inside' && (
                    <button onClick={() => markExit(scannedVisitor._id)} className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors shadow-sm">
                      <LogOut size={15} /> Mark Exit
                    </button>
                  )}
                  {['Expected', 'Inside'].includes(scannedVisitor.status) && (
                    <button onClick={() => denyVisitor(scannedVisitor._id)} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors">
                      <XCircle size={15} /> Deny
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-bold text-slate-900">Today's Expected Visitors</h2>
          <span className="px-2.5 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
            {expectedVisitors.length}
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : expectedVisitors.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-slate-400">
            <CheckCircle2 size={32} className="mx-auto mb-2 text-slate-300" />
            <p className="font-semibold">No expected visitors today</p>
          </div>
        ) : (
          <div className="space-y-3">
            {expectedVisitors.map((visitor) => (
              <ExpectedVisitorCard
                key={visitor._id}
                visitor={visitor}
                onEntry={() => markEntry(visitor._id)}
                onExit={() => markExit(visitor._id)}
                onDeny={() => denyVisitor(visitor._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Expected;
  const Icon = cfg.icon;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
      <Icon size={11} /> {status}
    </span>
  );
}

function ExpectedVisitorCard({ visitor, onEntry, onExit, onDeny }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4 hover:border-slate-300 hover:shadow-sm transition-all">
      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
        <User size={20} className="text-slate-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-bold text-slate-900 truncate">{visitor.name}</span>
          <StatusBadge status={visitor.status} />
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1"><Phone size={10} />{visitor.phone}</span>
          <span className="flex items-center gap-1"><Car size={10} />{visitor.purpose}</span>
          {visitor.host && <span className="font-medium text-slate-600">{visitor.host.name} · Flat {visitor.host.flatNumber}</span>}
        </div>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        {visitor.status === 'Expected' && (
          <button onClick={onEntry} className="p-2 bg-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-200 transition-colors" title="Mark Entry">
            <LogIn size={16} />
          </button>
        )}
        {visitor.status === 'Inside' && (
          <button onClick={onExit} className="p-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors" title="Mark Exit">
            <LogOut size={16} />
          </button>
        )}
        {['Expected', 'Inside'].includes(visitor.status) && (
          <button onClick={onDeny} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors" title="Deny">
            <XCircle size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
