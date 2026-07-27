import { useState } from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const ROLE_LABELS = {
  resident:    'Resident Dashboard',
  committee:   'Committee Dashboard',
  security:    'Security Dashboard',
  maintenance: 'Maintenance Dashboard',
  vendor:      'Vendor Dashboard',
};

const ROLE_COLORS = {
  resident:    '#6366f1',
  committee:   '#7c3aed',
  security:    '#2563eb',
  maintenance: '#d97706',
  vendor:      '#059669',
};

export default function Topbar({ onMenuToggle, title }) {
  const { user } = useAuthStore();
  const [hasNotifications] = useState(true);
  const accentColor = ROLE_COLORS[user?.role] || '#6366f1';

  return (
    <header className="topbar">
      {/* Left */}
      <div className="flex items-center gap-3 flex-1">
        <button id="sidebar-toggle" onClick={onMenuToggle}
          className="lg:hidden btn btn-ghost btn-sm p-2">
          <Menu size={19} />
        </button>
        <div>
          <h1 className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>
            {title || ROLE_LABELS[user?.role] || 'Dashboard'}
          </h1>
          <p className="text-xs hidden sm:block" style={{ color: 'var(--color-text-muted)' }}>
            Welcome back, {user?.firstName}!
          </p>
        </div>
      </div>

      {/* Center — Search */}
      <div className="hidden md:flex items-center flex-1 max-w-xs">
        <div className="relative w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--color-text-muted)' }} />
          <input
            id="global-search"
            type="search"
            placeholder="Search..."
            className="input pl-9 text-sm"
            style={{ height: '36px', borderRadius: '24px', background: '#f8fafc' }}
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 flex-1 justify-end">
        {/* Notification bell */}
        <button id="notifications-btn"
          className="w-9 h-9 rounded-full flex items-center justify-center relative transition-all hover:bg-gray-100"
          style={{ color: 'var(--color-text-secondary)' }}>
          <Bell size={18} />
          {hasNotifications && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          )}
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2 pl-2 border-l" style={{ borderColor: 'var(--border-color)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)` }}>
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="hidden sm:block">
            <div className="text-xs font-semibold" style={{ color: 'var(--color-text-primary)', lineHeight: 1.2 }}>
              {user?.firstName} {user?.lastName}
            </div>
            <div className="text-xs capitalize" style={{ color: 'var(--color-text-muted)' }}>
              {user?.role}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
