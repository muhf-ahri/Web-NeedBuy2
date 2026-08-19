import React, { useCallback, useEffect, useState } from 'react';

import SellerLayout from './SellerLayout';
import Reveal from '../../components/ui/Reveal';
import Pagination from '../../components/ui/Pagination';
import Icon from '../../components/ui/Icon';

import OrdersHeader from '../../components/seller_orders/OrdersHeader';
import OrdersFilters from '../../components/seller_orders/OrdersFilters';
import OrdersTable from '../../components/seller_orders/OrdersTable';
import OrdersMobileList from '../../components/seller_orders/OrdersMobileList';
import OrdersEmptyState from '../../components/seller_orders/OrdersEmptyState';

import {
  getSellerOrders,
  updateOrderStatus,
  type OrdersMeta,
  type OrderStatus,
  type SellerOrder,
} from '../../api/orders';

const PAGE_SIZE = 10;

type FilterValue = OrderStatus | 'ALL';

const SELLER_ACTION: Partial<
  Record<OrderStatus, { to: 'SHIPPED' | 'DELIVERED'; label: string }>
> = {
  PROCESSING: { to: 'SHIPPED', label: 'Tandai Dikirim' },
  SHIPPED: { to: 'DELIVERED', label: 'Tandai Sampai' },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [meta, setMeta] = useState<OrdersMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState<FilterValue>('ALL');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);

  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getSellerOrders({
        status: status === 'ALL' ? undefined : status,
        q: debouncedSearch || undefined,
        page,
        limit: PAGE_SIZE,
      });
      setOrders(result.items);
      setMeta(result.meta);
    } catch (err: any) {
      setError(err?.message ?? 'Gagal muat order, coba lagi ya');
    } finally {
      setLoading(false);
    }
  }, [status, debouncedSearch, page]);

  useEffect(() => {
    load();
  }, [load]);

  const advance = async (order: SellerOrder) => {
    const action = SELLER_ACTION[order.status];
    if (!action) return;
    setBusyId(order.id);
    setActionError(null);
    try {
      await updateOrderStatus(order.id, action.to);
      await load();
    } catch (err: any) {
      setActionError(err?.message ?? 'Gagal ubah status order, coba lagi ya');
    } finally {
      setBusyId(null);
    }
  };

  const toggleExpand = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  const clearFilters = () => {
    setSearch('');
    setStatus('ALL');
    setPage(1);
  };

  const getStatusLabel = (o: SellerOrder) => o.statusPengirimanLabel;

  return (
    <SellerLayout>
      <div className="space-y-5 sm:space-y-6">
        
        <Reveal direction="up">
          <OrdersHeader totalOrders={meta?.total ?? 0} loading={loading} />
        </Reveal>

        <Reveal direction="up" delay={80}>
          <OrdersFilters
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
          />
        </Reveal>

        {actionError && (
          <Reveal direction="up">
            <div
              className="
                flex items-center gap-3 rounded-2xl border
                border-[#ba1a1a]/20 bg-[#FFF0F0] px-4 py-3 backdrop-blur-sm
              "
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ba1a1a]/15">
                <Icon name="alert" size={15} className="text-[#ba1a1a]" />
              </span>
              <p className="flex-1 text-[13px] font-medium text-[#ba1a1a]">
                {actionError}
              </p>
              <button
                type="button"
                onClick={() => setActionError(null)}
                className="shrink-0 rounded-full p-1 text-[#ba1a1a] hover:bg-white"
                aria-label="Tutup"
              >
                <Icon name="close" size={14} />
              </button>
            </div>
          </Reveal>
        )}

        <Reveal direction="up">
          {loading ? (
            <div
              className="
                overflow-hidden rounded-[24px] border border-white/80
                bg-white/95 shadow-[0_8px_24px_rgba(32,36,45,0.06)]
                backdrop-blur-sm
              "
            >
              <div className="divide-y divide-[#F5F7FB]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-4">
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-24 animate-pulse rounded-full bg-[#F5F7FB]" />
                      <div className="h-4 w-3/4 animate-pulse rounded-full bg-[#F5F7FB]" />
                      <div className="h-3 w-1/2 animate-pulse rounded-full bg-[#F5F7FB]" />
                    </div>
                    <div className="h-8 w-28 animate-pulse rounded-full bg-[#F5F7FB]" />
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
            <OrdersEmptyState
              variant="error"
              errorMessage={error}
              onRetry={load}
            />
          ) : orders.length === 0 ? (
            <OrdersEmptyState
              variant={debouncedSearch || status !== 'ALL' ? 'no-match' : 'empty'}
              query={debouncedSearch}
              onClearFilters={clearFilters}
            />
          ) : (
            <div
              className="
                overflow-hidden rounded-[24px] border border-white/80
                bg-white/95 shadow-[0_8px_24px_rgba(32,36,45,0.06)]
                backdrop-blur-sm
              "
            >
              
              <div className="hidden lg:block">
                <OrdersTable
                  orders={orders}
                  expandedId={expandedId}
                  busyId={busyId}
                  getAction={(o) => SELLER_ACTION[o.status]}
                  getStatusLabel={getStatusLabel}
                  formatDate={formatDate}
                  onToggleExpand={toggleExpand}
                  onAdvance={advance}
                />
              </div>

              <div className="p-3 lg:hidden sm:p-4">
                <OrdersMobileList
                  orders={orders}
                  expandedId={expandedId}
                  busyId={busyId}
                  getAction={(o) => SELLER_ACTION[o.status]}
                  getStatusLabel={getStatusLabel}
                  formatDate={formatDate}
                  onToggleExpand={toggleExpand}
                  onAdvance={advance}
                />
              </div>

              {meta && (
                <Pagination
                  currentPage={meta.page}
                  totalPages={meta.totalPages}
                  totalItems={meta.total}
                  pageSize={PAGE_SIZE}
                  onPageChange={setPage}
                  className="px-4 py-3 sm:px-5"
                />
              )}
            </div>
          )}
        </Reveal>
      </div>
    </SellerLayout>
  );
};

export default OrdersPage;