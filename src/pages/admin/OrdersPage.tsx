// src/pages/admin/OrdersPage.tsx
import React, { useCallback, useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import FilterBar from '../../components/ui/filter/FilterBar';
import Pagination from '../../components/ui/Pagination';
import OrderTable, { statusLabel } from './components/OrderTable';
import { getOrders, type AdminOrder, type OrderStatus, type PaymentStatus } from '../../api/admin';

/** Tab "Semua" = tanpa filter status, jadi nilainya string kosong. */
type Tab = '' | Extract<OrderStatus, 'PROCESSING' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED'>;

const TABS: Tab[] = ['', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED'];

const PAGE_SIZE = 10;

const OrdersPage: React.FC = () => {
  const [status, setStatus] = useState<Tab>('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | ''>('');
  const [page, setPage] = useState(1);

  const [items, setItems] = useState<AdminOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setIsLoading(true);
    setError(null);
    return getOrders({
      status: status || undefined,
      paymentStatus: paymentStatus || undefined,
      page,
      limit: PAGE_SIZE,
    })
      .then((res) => {
        setItems(res.data.data);
        setTotal(res.data.meta.total);
        setTotalPages(res.data.meta.totalPages);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [status, paymentStatus, page]);

  useEffect(() => {
    void load();
  }, [load]);

  const paymentOptions = [
    { label: 'Semua Pembayaran', value: '' },
    { label: 'Lunas', value: 'PAID' },
    { label: 'Menunggu', value: 'PENDING' },
    { label: 'Gagal', value: 'FAILED' },
    { label: 'Kedaluwarsa', value: 'EXPIRED' },
    { label: 'Dikembalikan', value: 'REFUNDED' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#191c1e]">Pesanan</h1>
          <p className="text-[15px] text-[#737686]">Kelola dan lacak semua pesanan marketplace.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-[#e0e3e5]">
          {TABS.map((tab) => (
            <button
              key={tab || 'all'}
              onClick={() => {
                setStatus(tab);
                setPage(1);
              }}
              className={`px-4 py-2 text-sm font-semibold transition-colors border-b-2 ${
                status === tab
                  ? 'border-[#004ac6] text-[#004ac6]'
                  : 'border-transparent text-[#737686] hover:text-[#191c1e]'
              }`}
            >
              {tab ? statusLabel[tab] : 'Semua'}
            </button>
          ))}
        </div>

        {/* Filter */}
        <FilterBar
          filters={[
            {
              key: 'payment',
              options: paymentOptions,
              value: paymentStatus,
              onChange: (val) => {
                setPaymentStatus(val as PaymentStatus | '');
                setPage(1);
              },
            },
          ]}
          visibleFilters={1}
        />

        {error && (
          <div className="rounded-2xl border border-[#ffcdd2] bg-[#fff5f5] p-4 text-[13px] text-[#a33131]">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-[#e0e3e5] bg-white p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f2f4f6] text-[11px] font-semibold uppercase text-[#737686]">
                  <th className="pb-2 pr-2 text-left">ID Order</th>
                  <th className="pb-2 pr-2 text-left">Pembeli</th>
                  <th className="pb-2 pr-2 text-left">Toko</th>
                  <th className="pb-2 pr-2 text-center">Item</th>
                  <th className="pb-2 pr-2 text-left">Total</th>
                  <th className="pb-2 pr-2 text-center">Pembayaran</th>
                  <th className="pb-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f4f6]">
                <OrderTable
                  orders={items}
                  isLoading={isLoading}
                  emptyMessage={status ? 'Nggak ada order di status ini.' : 'Belum ada order.'}
                />
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 border-t border-[#e0e3e5] pt-4">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={total}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
                showTotal
              />
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrdersPage;
