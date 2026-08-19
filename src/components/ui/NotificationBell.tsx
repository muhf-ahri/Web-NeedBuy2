import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

import Icon from './Icon';
import {
  getNotifications,
  getUnreadCount,
  readAllNotifications,
  readNotification,
  type Notification,
} from '../../api/notifications';
import { useNotificationSocket } from '../../hooks/useNotificationSocket';
import { useAuth } from '../../contexts/AuthContext';
import { relativeTime, linkFor, metaFor } from '../notifications/notfications.helpers';

const NotificationBell: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadList = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getNotifications({ limit: 20 });
      setNotifications(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (err: any) {
      setError(err?.message ?? 'Gagal muat notifikasi, coba lagi ya');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      setNotifications([]);
      return;
    }

    getUnreadCount()
      .then((response) => setUnreadCount(response.data?.data?.unreadCount ?? 0))
      .catch(() => setUnreadCount(0));
  }, [isAuthenticated]);

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
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
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
      <button
        type="button"
        onClick={toggleOpen}
        className="relative flex items-center justify-center"
        aria-label="Notifikasi"
        aria-expanded={isOpen}
      >
        <Icon name="bell" size={20} />

        {unreadCount > 0 && (
          <span
            className="
              absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center
              justify-center rounded-full bg-[#ba1a1a] px-0.5 text-[9px]
              font-bold leading-none text-white ring-2 ring-white
            "
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="
            absolute right-0 top-full z-50 mt-2 w-[340px] overflow-hidden
            rounded-2xl border border-[#e0e3e5] bg-white
            shadow-[0_18px_50px_rgba(32,36,45,0.15)] notif-dropdown-in
          "
        >

          <div className="flex items-center justify-between border-b border-[#e0e3e5] px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-bold text-[#4077a6]">Notifikasi</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-[#ba1a1a] px-1.5 py-0.5 text-[9px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[11px] font-semibold text-[#4077a6] transition-colors hover:text-[#4077a6]"
              >
                Tandai semua dibaca
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {!isAuthenticated ? (
              <div className="px-4 py-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F7FB]">
                  <Icon name="bell" size={20} className="text-[#A2A8B3]" />
                </div>
                <p className="mt-3 text-[13px] font-semibold text-[#101319]">
                  Masuk untuk melihat notifikasi
                </p>
                <p className="mt-1 text-[11px] text-[#737686]">
                  Pantau status pesanan dan penawaran spesial langsung di sini.
                </p>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="mt-3 inline-block rounded-xl bg-[#4077a6] px-4 py-2 text-[11px] font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Masuk sekarang
                </Link>
              </div>
            ) : loading ? (
              <div className="space-y-1 p-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-3 rounded-xl p-3">
                    <div className="h-9 w-9 shrink-0 animate-pulse rounded-lg bg-[#F5F7FB]" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-3/4 animate-pulse rounded-full bg-[#F5F7FB]" />
                      <div className="h-3 w-1/2 animate-pulse rounded-full bg-[#F5F7FB]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="px-4 py-8 text-center text-[12px] font-medium text-[#ba1a1a]">
                {error}
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F7FB]">
                  <Icon name="bell" size={20} className="text-[#A2A8B3]" />
                </div>
                <p className="mt-3 text-[13px] font-semibold text-[#101319]">
                  Tidak ada notifikasi
                </p>
                <p className="mt-1 text-[11px] text-[#A2A8B3]">
                  Semua kabar baik, belum ada update baru.
                </p>
              </div>
            ) : (
              notifications.map((notification) => {
                const link = linkFor(notification, user?.role);
                const isUnread = !notification.read;
                const meta = metaFor(notification);

                const content = (
                  <div className="flex items-start gap-3">
                    <span
                      className={`
                        mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center
                        rounded-lg ${isUnread ? `${meta.bg} ${meta.text}` : 'bg-[#F5F7FB] text-[#A2A8B3]'}
                      `}
                    >
                      <Icon name={meta.icon} size={15} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`
                            text-[13px] leading-snug
                            ${isUnread ? 'font-semibold text-[#101319]' : 'font-medium text-[#101319]'}
                          `}
                        >
                          {notification.title}
                        </p>
                        {isUnread && (
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4077a6]" />
                        )}
                      </div>

                      <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-[#737686]">
                        {notification.message}
                      </p>

                      {notification.order && (
                        <p className="mt-1 font-mono text-[10px] text-[#434655]">
                          {notification.order.orderNumber}
                          {notification.order.orderType ? ` · ${notification.order.orderType}` : ''}
                          {' · '}
                          {notification.order.items
                            .map((item) => `${item.productName} x${item.quantity}`)
                            .join(', ')}
                        </p>
                      )}

                      <p className="mt-1 text-[10px] text-[#A2A8B3]">
                        {relativeTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                );

                const itemClass = `
                  block w-full px-3 py-2.5 text-left transition-colors
                  ${isUnread ? 'bg-[#f5f7fb] hover:bg-[#f5f7fb]' : 'hover:bg-[#F5F7FB]'}
                `;

                return (
                  <div key={notification.id} className="border-b border-[#F5F7FB] last:border-0">
                    {link ? (
                      <Link
                        to={link}
                        onClick={() => {
                          markAsRead(notification.id);
                          setIsOpen(false);
                        }}
                        className={itemClass}
                      >
                        {content}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => markAsRead(notification.id)}
                        className={itemClass}
                      >
                        {content}
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <Link
            to="/notifications"
            onClick={() => setIsOpen(false)}
            className="
              flex items-center justify-between border-t border-[#e0e3e5]
              px-4 py-2.5 text-[12px] font-semibold text-[#4077a6]
              transition-colors hover:bg-[#F5F7FB]
            "
          >
            Lihat semua notifikasi
            <Icon name="arrowRight" size={13} />
          </Link>
        </div>
      )}

      <style>{`
        @keyframes notif-dropdown-in {
          0% { opacity: 0; transform: translateY(-4px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .notif-dropdown-in {
          animation: notif-dropdown-in 0.18s cubic-bezier(0.22, 0.9, 0.35, 1) both;
          transform-origin: top right;
        }
      `}</style>
    </div>
  );
};

export default NotificationBell;