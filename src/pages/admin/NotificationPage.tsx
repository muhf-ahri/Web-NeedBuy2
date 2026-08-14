// src/pages/admin/NotificationPage.tsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import AdminLayout from './AdminLayout';
import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';
import FilterBar from '../../components/ui/filter/FilterBar';
import Pagination from '../../components/ui/Pagination';
import NotificationItem, { typeLabel } from './components/NotificationItem';
import { useNotificationSocket } from '../../hooks/useNotificationSocket';
import {
  getNotifications,
  readAllNotifications,
  readNotification,
  type Notification,
  type NotificationType,
} from '../../api/notifications';

const PAGE_SIZE = 5;
/** Batas atas `GET /notifications` di backend. */
const FETCH_LIMIT = 50;

/**
 * Backend mengirim seluruh daftar sekaligus (maksimal 50, tanpa query filter),
 * jadi filter dan paginasi dikerjakan di client. Yang datang dari server tetap
 * data asli — nggak ada yang dikarang di sini.
 */
const NotificationsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const load = useCallback(() => {
    setIsLoading(true);
    setError(null);
    return getNotifications({ limit: FETCH_LIMIT })
      .then((res) => setNotifications(res.data.data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  // Notifikasi baru langsung nyelip di atas tanpa perlu refresh halaman.
  useNotificationSocket((payload) => {
    if (payload.event !== 'notification') return;
    setNotifications((prev) => [payload.data, ...prev].slice(0, FETCH_LIMIT));
  });

  const filteredData = useMemo(
    () =>
      notifications.filter((n) => {
        if (typeFilter && n.type !== typeFilter) return false;
        if (statusFilter === 'unread') return !n.read;
        if (statusFilter === 'read') return n.read;
        return true;
      }),
    [notifications, typeFilter, statusFilter]
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const paginatedData = filteredData.slice(startIndex, startIndex + PAGE_SIZE);

  const markRead = async (id: string) => {
    setPendingId(id);
    try {
      await readNotification(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true, readAt: new Date().toISOString() } : n))
      );
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setPendingId(null);
    }
  };

  const markAllRead = async () => {
    try {
      await readAllNotifications();
      await load();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const typeOptions = [
    { label: 'Semua Tipe', value: '' },
    ...(Object.keys(typeLabel) as NotificationType[]).map((type) => ({
      label: typeLabel[type],
      value: type,
    })),
  ];

  const statusOptions = [
    { label: 'Semua Status', value: '' },
    { label: 'Belum Dibaca', value: 'unread' },
    { label: 'Sudah Dibaca', value: 'read' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#191c1e]">Notifikasi</h1>
          <p className="text-[15px] text-[#737686]">
            Pantau alert sistem, update pesanan, dan pembayaran.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <FilterBar
            filters={[
              {
                key: 'type',
                options: typeOptions,
                value: typeFilter,
                onChange: (val) => {
                  setTypeFilter(val);
                  setPage(1);
                },
              },
              {
                key: 'status',
                options: statusOptions,
                value: statusFilter,
                onChange: (val) => {
                  setStatusFilter(val);
                  setPage(1);
                },
              },
            ]}
            visibleFilters={2}
          />

          <Button
            variant="primary"
            onClick={() => void markAllRead()}
            disabled={unreadCount === 0}
            className="flex items-center gap-2 px-5 py-2.5 text-sm"
          >
            <Icon name="check" size={16} />
            Tandai Semua Dibaca
          </Button>
        </div>

        {error && (
          <div className="rounded-2xl border border-[#ffcdd2] bg-[#fff5f5] p-4 text-[13px] text-[#a33131]">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-[#e0e3e5] bg-white p-3 text-center">
            <p className="text-[11px] font-semibold uppercase text-[#737686]">Total</p>
            <p className="text-xl font-bold text-[#191c1e]">{notifications.length}</p>
          </div>
          <div className="rounded-xl border border-[#e0e3e5] bg-white p-3 text-center">
            <p className="text-[11px] font-semibold uppercase text-[#737686]">Belum Dibaca</p>
            <p className="text-xl font-bold text-[#ba1a1a]">{unreadCount}</p>
          </div>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <div className="rounded-2xl border border-[#e0e3e5] bg-white p-10 text-center text-[#737686]">
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-[#004ac6] border-t-transparent" />
              <span className="ml-2">Memuat…</span>
            </div>
          ) : paginatedData.length === 0 ? (
            <div className="rounded-2xl border border-[#e0e3e5] bg-white p-10 text-center text-[#737686]">
              {typeFilter || statusFilter
                ? 'Nggak ada notifikasi yang cocok sama filter ini.'
                : 'Belum ada notifikasi.'}
            </div>
          ) : (
            paginatedData.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkRead={(id) => void markRead(id)}
                pending={pendingId === notification.id}
              />
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="border-t border-[#e0e3e5] pt-4">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
              showTotal
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default NotificationsPage;
