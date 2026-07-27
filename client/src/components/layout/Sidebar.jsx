import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home, Users, Shield, Wrench, ShoppingBag, Bell, FileText,
  Calendar, Car, Vote, Search, AlertTriangle, BarChart3,
  MessageSquare, LogOut, Settings, X, Building2,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/auth.service';
import toast from 'react-hot-toast';

const ROLE_MENUS = {
  resident: [
    { label: 'Dashboard', icon: Home, to: '/dashboard/resident' },
    { label: 'Visitor Passes', icon: Users, to: '/visitors' },
    { label: 'Complaints', icon: Wrench, to: '/complaints' },
    { label: 'Maintenance Bill', icon: FileText, to: '/billing' },
    { label: 'Facility Booking', icon: Calendar, to: '/facilities' },
    { label: 'Parking', icon: Car, to: '/parking' },
    { label: 'Notice Board', icon: Bell, to: '/notices' },
    { label: 'Polls & Voting', icon: Vote, to: '/polls' },
    { label: 'Events', icon: Calendar, to: '/events' },
    { label: 'Marketplace', icon: ShoppingBag, to: '/marketplace' },
    { label: 'Lost & Found', icon: Search, to: '/lost-found' },
    { label: 'Community Chat', icon: MessageSquare, to: '/chat' },
  ],
  committee: [
    { label: 'Dashboard', icon: BarChart3, to: '/dashboard/committee' },
    { label: 'Residents', icon: Users, to: '/residents' },
    { label: 'Visitors', icon: Shield, to: '/visitors/all' },
    { label: 'Complaints', icon: Wrench, to: '/complaints/manage' },
    { label: 'Billing', icon: FileText, to: '/billing/manage' },
    { label: 'Notice Board', icon: Bell, to: '/notices/manage' },
    { label: 'Polls', icon: Vote, to: '/polls/manage' },
    { label: 'Events', icon: Calendar, to: '/events/manage' },
    { label: 'Facilities', icon: Building2, to: '/facilities/manage' },
    { label: 'Parking', icon: Car, to: '/parking/manage' },
    { label: 'Vendors', icon: ShoppingBag, to: '/vendors' },
    { label: 'Analytics', icon: BarChart3, to: '/analytics' },
  ],
  security: [
    { label: 'Dashboard', icon: Home, to: '/dashboard/security' },
    { label: 'Visitor Gate', icon: Shield, to: '/visitors/gate' },
    { label: 'Expected Visitors', icon: Users, to: '/visitors/expected' },
    { label: 'Incident Reports', icon: AlertTriangle, to: '/incidents' },
    { label: 'Vehicle Logs', icon: Car, to: '/vehicles' },
    { label: 'Emergency SOS', icon: AlertTriangle, to: '/sos' },
  ],
  maintenance: [
    { label: 'Dashboard', icon: Home, to: '/dashboard/maintenance' },
    { label: 'My Tasks', icon: Wrench, to: '/tasks' },
    { label: 'Complaints', icon: AlertTriangle, to: '/complaints/assigned' },
    { label: 'Task History', icon: FileText, to: '/tasks/history' },
  ],
  vendor: [
    { label: 'Dashboard', icon: Home, to: '/dashboard/vendor' },
    { label: 'Service Requests', icon: Wrench, to: '/service-requests' },
    { label: 'My Jobs', icon: FileText, to: '/jobs' },
    { label: 'Upload Bills', icon: FileText, to: '/bills' },
  ],
};

const ROLE_COLORS = {
  resident:    '#6366f1',
  committee:   '#7c3aed',
  security:    '#2563eb',
  maintenance: '#d97706',
  vendor:      '#059669',
};

const ROLE_LABELS = {
  resident:    'Resident',
  committee:   'Committee',
  security:    'Security Guard',
  maintenance: 'Maintenance',
  vendor:      'Vendor',
};

const ROLE_BG = {
  resident:    '#eef2ff',
  committee:   '#f5f3ff',
  security:    '#eff6ff',
  maintenance: '#fffbeb',
  vendor:      '#f0fdf4',
};

export default function Sidebar({ isOpen, onClose }) {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const menuItems = ROLE_MENUS[user?.role] || [];
  const accentColor = ROLE_COLORS[user?.role] || '#6366f1';
  const accentBg   = ROLE_BG[user?.role]    || '#eef2ff';

  const handleLogout = async () => {
    try { await authService.logout(); } catch (_) {}
    clearAuth();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[99] lg:hidden"
          onClick={onClose} />
      )}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)` }}>
              S
            </div>
            <div>
              <div className="font-bold text-sm leading-tight" style={{ color: 'var(--color-text-primary)' }}>
                Smart Society
              </div>
              <div className="text-xs font-medium" style={{ color: accentColor }}>Hub</div>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden btn btn-ghost btn-sm p-1.5">
            <X size={15} />
          </button>
        </div>

        {/* User card */}
        <div className="mx-3 mt-3 mb-2 p-3 rounded-xl" style={{ background: accentBg, border: `1px solid ${accentColor}20` }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)` }}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>
                {user?.firstName} {user?.lastName}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: `${accentColor}20`, color: accentColor }}>
                  {ROLE_LABELS[user?.role]}
                </span>
                {user?.flatNumber && (
                  <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    #{user.flatNumber}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section label */}
        <div className="px-5 py-2">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
            Navigation
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 space-y-0.5 pb-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              style={({ isActive }) => isActive ? {
                background: accentBg,
                color: accentColor,
                borderColor: `${accentColor}30`,
              } : {}}
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <NavLink to="/settings" className="sidebar-item" onClick={onClose}>
            <Settings size={16} />
            <span>Settings</span>
          </NavLink>
          <button onClick={handleLogout} className="sidebar-item w-full text-left mt-1"
            style={{ color: '#dc2626' }}
            onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
