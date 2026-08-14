// src/pages/admin/NotificationsPage.tsx
import React, { useState, useMemo } from 'react';
import AdminLayout from './AdminLayout';
import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';
import FilterBar from '../../components/ui/filter/FilterBar';
import Pagination from '../../components/ui/Pagination';
import NotificationItem from './components/NotificationItem';
import { DUMMY_NOTIFICATIONS, type NotificationCategory } from './data/notificationsData';

const PAGE_SIZE = 5;

const NotificationsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS);

  const filteredData = useMemo(() => {
    let data = [...notifications];

    if (categoryFilter !== 'all') {
      data = data.filter((n) => n.category === categoryFilter);
    }

    if (statusFilter === 'unread') {
      data = data.filter((n) => n.status === 'unread');
    } else if (statusFilter === 'read') {
      data = data.filter((n) => n.status === 'read');
    }

    return data;
  }, [notifications, categoryFilter, statusFilter]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.status === 'unread').length,
    [notifications]
  );

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const paginatedData = filteredData.slice(startIndex, startIndex + PAGE_SIZE);

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: 'read' as const } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, status: 'read' as const }))
    );
  };

  const categoryOptions = [
    { label: 'Semua Kategori', value: 'all' },
    { label: 'Sistem', value: 'System' },
    { label: 'Pesanan', value: 'Orders' },
    { label: 'Pembayaran', value: 'Payments' },
    { label: 'Laporan', value: 'Reports' },
  ];

  const statusOptions = [
    { label: 'Semua Status', value: 'all' },
    { label: 'Belum Dibaca', value: 'unread' },
    { label: 'Sudah Dibaca', value: 'read' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-[28px] font-bold text-[#191c1e]">Notifikasi</h1>
          <p className="text-[15px] text-[#737686]">
            Kelola sistem alert, update, dan komunikasi.
          </p>
        </div>

        {/* Filter + Mark All Read */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <FilterBar
            filters={[
              {
                key: 'category',
                options: categoryOptions,
                value: categoryFilter,
                onChange: (val) => {
                  setCategoryFilter(val);
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
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-2 px-5 py-2.5 text-sm"
          >
            <Icon name="check" size={16} />
            Tandai Semua Dibaca
          </Button>
        </div>

        {/* Notification Summary */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl bg-white p-3 text-center border border-[#e0e3e5]">
            <p className="text-[11px] font-semibold uppercase text-[#737686]">Total</p>
            <p className="text-xl font-bold text-[#191c1e]">{notifications.length}</p>
          </div>
          <div className="rounded-xl bg-white p-3 text-center border border-[#e0e3e5]">
            <p className="text-[11px] font-semibold uppercase text-[#737686]">Belum Dibaca</p>
            <p className="text-xl font-bold text-[#ba1a1a]">{unreadCount}</p>
          </div>
          <div className="rounded-xl bg-white p-3 text-center border border-[#e0e3e5]">
            <p className="text-[11px] font-semibold uppercase text-[#737686]">Sistem</p>
            <p className="text-xl font-bold text-[#0057b8]">
              {notifications.filter((n) => n.category === 'System').length}
            </p>
          </div>
          <div className="rounded-xl bg-white p-3 text-center border border-[#e0e3e5]">
            <p className="text-[11px] font-semibold uppercase text-[#737686]">Pesanan</p>
            <p className="text-xl font-bold text-[#156b32]">
              {notifications.filter((n) => n.category === 'Orders').length}
            </p>
          </div>
        </div>

        {/* Notification List */}
        <div className="space-y-3">
          {paginatedData.length === 0 ? (
            <div className="rounded-2xl border border-[#e0e3e5] bg-white p-10 text-center text-[#737686]">
              Tidak ada notifikasi.
            </div>
          ) : (
            paginatedData.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkRead={handleMarkRead}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pt-4 border-t border-[#e0e3e5]">
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