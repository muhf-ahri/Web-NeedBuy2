// src/components/ui/NotificationBell.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Icon from './Icon';
import { Link } from 'react-router-dom';
import {
  getNotifications,
  getUnreadCount,
  readAllNotifications,
  readNotification,
  type Notification,
} from '../../api/notifications';
import { useNotificationSocket } from '../../hooks/useNotificationSocket';

/** "5 menit lalu" tanpa library tanggal â€” kebutuhannya cuma satu baris ini. */
function relativeTime(iso: string): string {
  const seconds = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return 'baru saja';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.round(hours / 24);
  return days === 1 ? 'kemarin' : `${days} hari lalu`;
}

/** Notifikasi order diarahkan ke halaman order seller, sisanya sesuai tipenya. */
function linkFor(notification: Notification): string | undefined {
  switch (notification.type) {
    case 'ORDER_NEW':
    case 'ORDER_STATUS':
    case 'PAYMENT':
      return '/seller/orders';
    case 'LOW_STOCK':
      return '/seller/products';
    default:
      return undefined;
  }
}

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getNotifications({ limit: 20 });
      setNotifications(response.data.data);
    } catch (err: any) {
      setError(err?.message ?? 'Gagal muat notifikasi, coba lagi ya');
    } finally {
      setLoading(false);
    }
  }, []);

  // Badge dimuat sekali saat mount; setelah itu WebSocket yang memperbaruinya.
  useEffect(() => {
    getUnreadCount()
      .then((response) => setUnreadCount(response.data.data.unreadCount))
      .catch(() => setUnreadCount(0));
  }, []);

  // WebSocket: orderan masuk langsung mendorong badge + isi list, tanpa polling.
  useNotificationSocket((payload) => {
    if (payload.event === 'unread-count') {
      setUnreadCount(payload.data.unreadCount);
      return;
    }
    if (payload.event === 'notification') {
      setNotifications((prev) => [payload.data, ...prev].slice(0, 20));
    }
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggleOpen = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (next) loadList();
  };

  const markAsRead = async (id: string) => {
    // Optimistic: badge dan gaya "belum dibaca" ikut berubah sebelum server
    // menjawab. Nilai unreadCount yang benar tetap datang dari response/socket.
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try {
      const response = await readNotification(id);
      setUnreadCount(response.data.data.unreadCount);
    } catch {
      loadList();
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    try {
      await readAllNotifications();
    } catch {
      loadList();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={toggleOpen}
        className="relative p-2 rounded-full hover:bg-[#f2f4f6] transition-colors"
        aria-label="Notifikasi"
      >
        <Icon name="bell" size={20} className="text-[#434655]" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-[#ba1a1a] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#e0e3e5] overflow-hidden z-50 animate-slideDown">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#e0e3e5]">
            <span className="text-[13px] font-bold text-[#191c1e]">Notifikasi</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] text-[#004ac6] hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto">
            {loading ? (
              <div className="px-4 py-6 text-center text-[13px] text-[#737686]">Memuatâ€¦</div>
            ) : error ? (
              <div className="px-4 py-6 text-center text-[13px] text-[#ba1a1a]">{error}</div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-[13px] text-[#737686]">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => {
                const link = linkFor(notification);
                const body = (
                  <>
                    <p className="text-[13px] font-semibold text-[#191c1e]">
                      {notification.title}
                    </p>
                    <p className="text-[12px] text-[#737686] mt-0.5">{notification.message}</p>
                    {notification.order && (
                      <p className="text-[11px] text-[#434655] mt-1">
                        {notification.order.orderNumber}
                        {notification.order.orderType ? ` Â· ${notification.order.orderType}` : ''}
                        {' Â· '}
                        {notification.order.items
                          .map((item) => `${item.productName} x${item.quantity}`)
                          .join(', ')}
                      </p>
                    )}
                    <p className="text-[10px] text-[#c3c6d7] mt-1">
                      {relativeTime(notification.createdAt)}
                    </p>
                  </>
                );

                return (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 border-b border-[#f2f4f6] last:border-0 transition-colors hover:bg-[#f8f9fb] ${
                      !notification.read ? 'bg-[#f2f6ff]' : ''
                    }`}
                  >
                    {link ? (
                      <Link
                        to={link}
                        onClick={() => {
                          markAsRead(notification.id);
                          setIsOpen(false);
                        }}
                        className="block"
                      >
                        {body}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => markAsRead(notification.id)}
                        className="block w-full text-left"
                      >
                        {body}
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
