import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ShieldOff } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'var(--color-bg-primary)' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="text-8xl font-black gradient-text mb-4">404</div>
        <h2 className="text-2xl font-bold text-white mb-3">Page Not Found</h2>
        <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary btn-lg">
          <Home size={18} /> Go Home
        </Link>
      </motion.div>
    </div>
  );
}

export function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'var(--color-bg-primary)' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <ShieldOff size={36} className="text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Access Denied</h2>
        <p className="text-gray-500 mb-8">You don't have permission to access this page.</p>
        <Link to="/" className="btn btn-secondary btn-lg">
          <Home size={18} /> Go to Dashboard
        </Link>
      </motion.div>
    </div>
  );
}
