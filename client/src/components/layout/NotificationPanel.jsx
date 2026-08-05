import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, X, Check, CheckCheck, Trash2,
  LogIn, Wrench, CreditCard, Bell as BellIcon, AlertTriangle, Star,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { notificationService } from '../../services/notification.service';
import { useNavigate } from 'react-router-dom';

const TYPE_ICONS = {
  visitor_arrived: { icon: LogIn, color: '#10b981' },
  visitor_approved: { icon: LogIn, color: '#10b981' },
  visitor_rejected: { icon: X, color: '#ef4444' },
  complaint_update: { icon: Wrench, color: '#f59e0b' },
  complaint_assigned: { icon: Wrench, color: '#6366f1' },
  bill_due: { icon: CreditCard, color: '#f59e0b' },
  bill_paid: { icon: CreditCard, color: '#10b981' },
  notice_posted: { icon: BellIcon, color: '#8b5cf6' },
  sos_alert: { icon: AlertTriangle, color: '#ef4444' },
  system: { icon: Star, color: '#6b7280' },
};

export default function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const { data: countRes } = useQuery({
    queryKey: ['notification-count'],
    queryFn: () => notificationService.getUnreadCount(),
    refetchInterval: 30000,
  });

  const { data: notifsRes, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationService.getNotifications({ limit: 20 }),
    enabled: isOpen,
  });

  const unreadCount = countRes?.data?.count || 0;
  const notifications = notifsRes?.data?.notifications || [];

  const { mutate: markRead } = useMutation({
    mutationFn: (id) => notificationService.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
      queryClient.invalidateQueries(['notification-count']);
    },
  });

  const { mutate: markAllRead } = useMutation({
    mutationFn: () => notificationService.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
      queryClient.invalidateQueries(['notification-count']);
    },
  });

  const { mutate: deleteNotif } = useMutation({
    mutationFn: (id) => notificationService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
      queryClient.invalidateQueries(['notification-count']);
    },
  });

  const handleNotifClick = (notif) => {
    if (!notif.isRead) markRead(notif._id);
    if (notif.link) { navigate(notif.link); setIsOpen(false); }
  };

  return (
    <div ref={panelRef} style={{ position: 'relative' }}>
      <button
        id="notifications-btn"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: 42, height: 42, borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', border: `1.5px solid ${isOpen ? '#c7d2fe' : '#e8ecf4'}`,
          background: isOpen ? '#eef2ff' : '#ffffff', cursor: 'pointer',
          transition: 'all 0.2s ease', color: isOpen ? '#6366f1' : '#6b7280',
        }}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: -6, right: -6,
            minWidth: 18, height: 18, background: '#ef4444',
            borderRadius: 99, border: '2px solid white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 800, color: 'white', padding: '0 4px',
          }}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="notification-dropdown"
          >
            <div style={{ padding: '16px 20px 14px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: '#0f172a' }}>Notifications</div>
                {unreadCount > 0 && <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{unreadCount} unread</div>}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {unreadCount > 0 && (
                  <button onClick={() => markAllRead()} title="Mark all read"
                    style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: '#6366f1', background: '#eef2ff', border: 'none', borderRadius: 8, padding: '5px 10px', cursor: 'pointer' }}>
                    <CheckCheck size={13} /> All Read
                  </button>
                )}
                <button onClick={() => setIsOpen(false)}
                  style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: '#f1f5f9', color: '#9ca3af', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={14} />
                </button>
              </div>
            </div>

            <div style={{ maxHeight: 420, overflowY: 'auto' }}>
              {isLoading ? (
                <div style={{ padding: 24, textAlign: 'center' }}>
                  <div style={{ width: 24, height: 24, border: '3px solid #e8ecf4', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
                </div>
              ) : notifications.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>
                  <Bell size={32} style={{ margin: '0 auto 12px', color: '#e2e8f0' }} />
                  <div style={{ fontWeight: 600, fontSize: 14 }}>No notifications yet</div>
                </div>
              ) : (
                notifications.map((notif) => {
                  const typeCfg = TYPE_ICONS[notif.type] || TYPE_ICONS.system;
                  const Icon = typeCfg.icon;
                  return (
                    <div
                      key={notif._id}
                      onClick={() => handleNotifClick(notif)}
                      style={{
                        display: 'flex', gap: 12, padding: '14px 18px',
                        borderBottom: '1px solid #f8fafc', cursor: 'pointer',
                        background: notif.isRead ? '#ffffff' : '#fafbff',
                        transition: 'background 0.15s',
                        alignItems: 'flex-start',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.background = notif.isRead ? '#ffffff' : '#fafbff'}
                    >
                      <div style={{
                        width: 36, height: 36, borderRadius: 10, flexShrink: 0, marginTop: 2,
                        background: `${typeCfg.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon size={16} style={{ color: typeCfg.color }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: notif.isRead ? 500 : 700, fontSize: 13.5, color: '#0f172a', lineHeight: 1.3 }}>{notif.title}</div>
                        <div style={{ fontSize: 12.5, color: '#64748b', marginTop: 3, lineHeight: 1.4 }}>{notif.message}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>
                          {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                        {!notif.isRead && (
                          <button onClick={() => markRead(notif._id)} title="Mark read"
                            style={{ width: 24, height: 24, borderRadius: 6, border: 'none', background: '#eef2ff', color: '#6366f1', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Check size={12} />
                          </button>
                        )}
                        <button onClick={() => deleteNotif(notif._id)} title="Delete"
                          style={{ width: 24, height: 24, borderRadius: 6, border: 'none', background: 'transparent', color: '#cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#cbd5e1'; }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
