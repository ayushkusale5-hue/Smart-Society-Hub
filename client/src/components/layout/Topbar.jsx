import { useState } from 'react';
import { Menu, Bell, Search, ChevronDown } from 'lucide-react';
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
        <button id="sidebar-toggle" onClick={onMenuToggle}
          className="lg:hidden btn btn-ghost btn-icon-sm"
          style={{ color: '#6b7280' }}>
          <Menu size={19} />
        </button>
        <div>
          <h1 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.015em', lineHeight: 1.2 }}>
            {title || ROLE_LABELS[user?.role] || 'Dashboard'}
          </h1>
          <p className="hidden sm:block" style={{ fontSize: 13, color: '#9ca3af', marginTop: 2 }}>
            Welcome back, <span style={{ fontWeight: 600, color: '#6b7280' }}>{user?.firstName}!</span>
          </p>
        </div>
      </div>

      {/* Center — Search */}
      <div className="hidden md:flex items-center flex-1 justify-center" style={{ maxWidth: 340 }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input
            id="global-search"
            type="search"
            placeholder="Search anything..."
            className="input"
            style={{ paddingLeft: 42, height: 42, borderRadius: 99, background: '#f4f6fb', fontSize: 14, border: '1.5px solid #e8ecf4' }}
          />
        </div>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, justifyContent: 'flex-end' }}>
        {/* Notification bell */}
        <button id="notifications-btn"
          style={{ width: 42, height: 42, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', border: '1.5px solid #e8ecf4', background: '#ffffff', cursor: 'pointer', transition: 'all 0.2s ease', color: '#6b7280' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#c7d2fe'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#e8ecf4'}>
          <Bell size={18} />
          {hasNotifications && (
            <span style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, background: '#ef4444', borderRadius: '50%', border: '2px solid white' }} />
          )}
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 32, background: '#e8ecf4', margin: '0 4px' }} />

        {/* User avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '6px 10px', borderRadius: 12, transition: 'all 0.2s ease', border: '1.5px solid transparent' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#f4f6fb'; e.currentTarget.style.borderColor = '#e8ecf4'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}>
          <div style={{ width: 36, height: 36, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: 'white', background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`, flexShrink: 0 }}>
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="hidden sm:block">
            <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
              {user?.firstName} {user?.lastName}
            </div>
            <div style={{ fontSize: 12, color: '#9ca3af', textTransform: 'capitalize', marginTop: 2 }}>
              {user?.role}
            </div>
          </div>
          <ChevronDown size={14} style={{ color: '#9ca3af' }} className="hidden sm:block" />
        </div>
      </div>
    </header>
  );
}
