import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import Icon from '../components/ui/Icon';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Reveal from '../components/ui/Reveal';

import NotificationItem from '../components/notifications/NotificationsItem';
import NotificationsEmptyState from '../components/notifications/NotificationEmptyState';

import {
  getNotifications,
  getUnreadCount,
  readAllNotifications,
  readNotification,
  type Notification,
} from '../api/notifications';
import { useNotificationSocket } from '../hooks/useNotificationSocket';

type TabKey = 'ALL' | 'UNREAD';

const PAGE_SIZE = 20;
const stagger = (index: number, base = 50) => Math.min(index, 11) * base;

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();

  const [tab, setTab] = useState<TabKey>('ALL');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadInitial = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPage(1);
    try {
      const [listRes, countRes] = await Promise.all([
        getNotifications({ limit: PAGE_SIZE, page: 1 }),
        getUnreadCount(),
      ]);
      setNotifications(listRes.data.data);
      setHasMore(listRes.data.data.length === PAGE_SIZE);
      setUnreadCount(countRes.data.data.unreadCount);
    } catch (err: any) {
      setError(err?.message ?? 'Gagal muat notifikasi, coba lagi ya');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await getNotifications({ limit: PAGE_SIZE, page: nextPage });
      setNotifications((prev) => [...prev, ...res.data.data]);
      setHasMore(res.data.data.length === PAGE_SIZE);
      setPage(nextPage);
    } catch (err: any) {
      setError(err?.message ?? 'Gagal memuat lebih banyak notifikasi');
    } finally {
      setLoadingMore(false);
    }
  };

  useNotificationSocket((payload) => {
    if (payload.event === 'unread-count') {
      setUnreadCount(payload.data.unreadCount);
      return;
    }
    if (payload.event === 'notification') {
      setNotifications((prev) => [payload.data, ...prev].slice(0, 100));
      setHasMore(true);
    }
  });

  const handleRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      const res = await readNotification(id);
      setUnreadCount(res.data.data.unreadCount);
    } catch {
      loadInitial();
    }
  };

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    try {
      await readAllNotifications();
    } catch {
      loadInitial();
    }
  };

  const filtered =
    tab === 'UNREAD' ? notifications.filter((n) => !n.read) : notifications;

  const tabs: Array<{ key: TabKey; label: string }> = [
    { key: 'ALL', label: 'Semua' },
    { key: 'UNREAD', label: 'Belum dibaca' },
  ];

  return (
    <div
      className="min-h-screen flex flex-col bg-[#f5f7fb]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-8 sm:px-8">

        <Reveal direction="up">
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#538cbd]/10 px-2.5 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
                <p className="text-[9px] font-bold uppercase tracking-[0.20em] text-[#4077a6]">
                  Pusat kabar
                </p>
              </span>
            </div>

            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <h1
                  className="
                    text-[26px] font-extrabold leading-tight tracking-tight
                    text-[#101319] sm:text-[32px]
                  "
                >
                  Notifikasi
                </h1>
                <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-[#737686]">
                  Semua kabar penting tentang pesanan, pembayaran, dan stok dalam satu tempat.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {error && (
          <Reveal direction="up">
            <div
              className="
                mb-5 flex items-center gap-3 rounded-2xl border
                border-[#ba1a1a]/20 bg-[#FFF0F0] px-4 py-3 backdrop-blur-sm
              "
            >
              <span
                className="
                  flex h-8 w-8 shrink-0 items-center justify-center
                  rounded-full bg-[#ba1a1a]/15
                "
              >
                <Icon name="alert" size={15} className="text-[#ba1a1a]" />
              </span>
              <p className="flex-1 text-[13px] font-medium text-[#ba1a1a]">
                {error}
              </p>
              <button
                type="button"
                onClick={loadInitial}
                className="
                  shrink-0 rounded-full bg-[#ba1a1a] px-3 py-1 text-[11px]
                  font-semibold text-white transition-colors hover:bg-[#ba1a1a]
                "
              >
                Coba lagi
              </button>
            </div>
          </Reveal>
        )}

        <Reveal direction="up">
          <div
            className="
              mb-5 flex flex-wrap items-center justify-between gap-3
              rounded-2xl border border-white/80 bg-white/95 p-1.5
              shadow-[0_8px_24px_rgba(32,36,45,0.06)] backdrop-blur-sm
            "
          >
            <div className="flex gap-1">
              {tabs.map((t) => {
                const active = tab === t.key;
                const count =
                  t.key === 'UNREAD' ? unreadCount : notifications.length;
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setTab(t.key)}
                    className={`
                      flex items-center gap-1.5 rounded-xl px-3.5 py-2
                      text-[12px] font-semibold transition-all duration-200
                      ${
                        active
                          ? 'bg-[#4077a6] text-white shadow-[0_4px_12px_rgba(83,140,219,0.25)]'
                          : 'text-[#737686] hover:bg-[#F5F7FB] hover:text-[#101319]'
                      }
                    `}
                  >
                    {t.label}
                    {count > 0 && (
                      <span
                        className={`
                          rounded-full px-1.5 py-0.5 text-[9px] font-bold
                          ${
                            active
                              ? 'bg-white/20 text-white'
                              : 'bg-[#F5F7FB] text-[#737686]'
                          }
                        `}
                      >
                        {count > 99 ? '99+' : count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {unreadCount > 0 && tab === 'ALL' && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="
                  flex items-center gap-1.5 rounded-xl px-3 py-2 text-[12px]
                  font-semibold text-[#4077a6] transition-colors
                  hover:bg-[#f5f7fb]
                "
              >
                <Icon name="check" size={13} />
                Tandai semua dibaca
              </button>
            )}
          </div>
        </Reveal>

        {loading ? (
          <div
            className="
              overflow-hidden rounded-[24px] border border-white/80
              bg-white/95 shadow-[0_8px_24px_rgba(32,36,45,0.06)]
              backdrop-blur-sm
            "
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <Reveal key={i} direction="up" delay={stagger(i)} className="h-full">
                <div className="flex items-start gap-4 border-b border-[#F5F7FB] p-4 last:border-0 sm:p-5">
                  <div className="h-11 w-11 shrink-0 animate-pulse rounded-lg bg-[#F5F7FB]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-20 animate-pulse rounded-full bg-[#F5F7FB]" />
                    <div className="h-4 w-3/4 animate-pulse rounded-full bg-[#F5F7FB]" />
                    <div className="h-3 w-1/2 animate-pulse rounded-full bg-[#F5F7FB]" />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Reveal direction="up">
            <NotificationsEmptyState
              variant={tab === 'UNREAD' ? 'unread-empty' : 'all-empty'}
              onExplore={() => navigate('/categories')}
            />
          </Reveal>
        ) : (
          <>
            <div
              className="
                overflow-hidden rounded-[24px] border border-white/80
                bg-white/95 shadow-[0_8px_24px_rgba(32,36,45,0.06)]
                backdrop-blur-sm
              "
            >
              {filtered.map((n, i) => (
                <Reveal key={n.id} direction="up" delay={stagger(i, 30)}>
                  <div className="border-b border-[#F5F7FB] last:border-0">
                    <NotificationItem notification={n} onRead={handleRead} />
                  </div>
                </Reveal>
              ))}
            </div>

            {tab === 'ALL' && hasMore && (
              <Reveal direction="up" className="mt-6">
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="
                      flex items-center gap-2 rounded-full border
                      border-[#e0e3e5] bg-white px-6 py-2.5 text-[13px]
                      font-semibold text-[#101319] transition-all duration-200
                      hover:border-[#538cbd] hover:text-[#4077a6]
                      active:scale-[0.99] disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    {loadingMore ? (
                      <Icon name="clock" size={14} className="animate-spin" />
                    ) : (
                      <Icon name="plus" size={14} />
                    )}
                    {loadingMore ? 'Memuat…' : 'Muat lebih banyak'}
                  </button>
                </div>
              </Reveal>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default NotificationsPage;