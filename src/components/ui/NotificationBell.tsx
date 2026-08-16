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

/** "5 menit lalu" tanpa library tanggal. */
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

/** Notifikasi order diarahkan ke halaman order seller, sisanya sesuai tipe. */
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

  useEffect(() => {
    getUnreadCount()
      .then((response) => setUnreadCount(response.data.data.unreadCount))
      .catch(() => setUnreadCount(0));
  }, []);

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
      {/* ── Bell button — TIDAK punya warna sendiri, inherit dari navbar ── */}
      <button
        type="button"
        onClick={toggleOpen}
        className="relative flex items-center justify-center"
        aria-label="Notifikasi"
        aria-expanded={isOpen}
      >
        {/* Icon tanpa class warna → ikut currentColor parent (navbar wrapper) */}
        <Icon name="bell" size={20} />

        {/* Badge unread — merah brand #FF4646, ring putih biar pop di kedua mode */}
        {unreadCount > 0 && (
          <span
            className="
              absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center
              justify-center rounded-full bg-[#FF4646] px-0.5 text-[9px]
              font-bold leading-none text-white ring-2 ring-white
            "
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* ── Dropdown — palet brand NeedBuy ── */}
      {isOpen && (
        <div
          className="
            absolute right-0 top-full z-50 mt-2 w-[340px] overflow-hidden
            rounded-2xl border border-[#E8ECF4] bg-white
            shadow-[0_18px_50px_rgba(32,36,45,0.15)] notif-dropdown-in
          "
        >
          {/* Header */}
          <div
            className="
              flex items-center justify-between border-b border-[#E8ECF4]
              px-4 py-3
            "
          >
            <div className="flex items-center gap-2">
              <span
                className="
                  flex h-7 w-7 items-center justify-center rounded-lg
                  bg-[#538CDB]/10
                "
              >
                <Icon name="bell" size={14} className="text-[#538CDB]" />
              </span>
              <span className="text-[13px] font-bold text-[#20242D]">
                Notifikasi
              </span>
              {unreadCount > 0 && (
                <span
                  className="
                    rounded-full bg-[#FF4646] px-1.5 py-0.5 text-[9px]
                    font-bold text-white
                  "
                >
                  {unreadCount}
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="
                  text-[11px] font-semibold text-[#538CDB] transition-colors
                  hover:text-[#467BC7]
                "
              >
                Tandai semua dibaca
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
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
              <div
                className="
                  px-4 py-8 text-center text-[12px] font-medium text-[#FF4646]
                "
              >
                {error}
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <div
                  className="
                    mx-auto flex h-12 w-12 items-center justify-center
                    rounded-full bg-[#F5F7FB]
                  "
                >
                  <Icon name="bell" size={20} className="text-[#A2A8B3]" />
                </div>
                <p className="mt-3 text-[13px] font-semibold text-[#20242D]">
                  Tidak ada notifikasi
                </p>
                <p className="mt-1 text-[11px] text-[#A2A8B3]">
                  Semua kabar baik, belum ada update baru.
                </p>
              </div>
            ) : (
              notifications.map((notification) => {
                const link = linkFor(notification);
                const isUnread = !notification.read;

                const content = (
                  <>
                    <div className="flex items-start gap-3">
                      {/* Icon indicator */}
                      <span
                        className={`
                          mt-0.5 flex h-8 w-8 shrink-0 items-center
                          justify-center rounded-lg
                          ${
                            isUnread
                              ? 'bg-[#538CDB]/10 text-[#538CDB]'
                              : 'bg-[#F5F7FB] text-[#A2A8B3]'
                          }
                        `}
                      >
                        <Icon
                          name={
                            notification.type === 'LOW_STOCK'
                              ? 'alert'
                              : notification.type === 'PAYMENT'
                                ? 'card'
                                : 'orders'
                          }
                          size={15}
                        />
                      </span>

                      {/* Body */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={`
                              text-[13px] leading-snug
                              ${
                                isUnread
                                  ? 'font-semibold text-[#20242D]'
                                  : 'font-medium text-[#20242D]'
                              }
                            `}
                          >
                            {notification.title}
                          </p>
                          {isUnread && (
                            <span
                              className="
                                mt-1 h-1.5 w-1.5 shrink-0 rounded-full
                                bg-[#538CDB]
                              "
                            />
                          )}
                        </div>

                        <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-[#737A87]">
                          {notification.message}
                        </p>

                        {notification.order && (
                          <p className="mt-1 font-mono text-[10px] text-[#434655]">
                            {notification.order.orderNumber}
                            {notification.order.orderType
                              ? ` · ${notification.order.orderType}`
                              : ''}
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
                  </>
                );

                const itemClass = `
                  block w-full px-3 py-2.5 text-left transition-colors
                  ${
                    isUnread
                      ? 'bg-[#F5F5FF] hover:bg-[#EEF5FF]'
                      : 'hover:bg-[#F5F7FB]'
                  }
                `;

                return (
                  <div
                    key={notification.id}
                    className="border-b border-[#F5F7FB] last:border-0"
                  >
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

          {/* Footer */}
          <Link
            to="/notifications"
            onClick={() => setIsOpen(false)}
            className="
              flex items-center justify-between border-t border-[#E8ECF4]
              px-4 py-2.5 text-[12px] font-semibold text-[#538CDB]
              transition-colors hover:bg-[#F5F7FB]
            "
          >
            Lihat semua notifikasi
            <Icon name="arrowRight" size={13} />
          </Link>
        </div>
      )}

      {/* Animasi dropdown */}
      <style>{`
        @keyframes notif-dropdown-in {
          0% {
            opacity: 0;
            transform: translateY(-4px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
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