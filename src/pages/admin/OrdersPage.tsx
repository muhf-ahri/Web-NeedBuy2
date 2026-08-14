// src/pages/admin/OrdersPage.tsx
import React, { useState, useMemo } from 'react';
import AdminLayout from './AdminLayout';
import FilterBar from '../../components/ui/filter/FilterBar';
import Pagination from '../../components/ui/Pagination';
import OrderTable from './components/OrderTable';
import { DUMMY_ORDERS, type OrderStatus } from './data/ordersData';

type TabType = OrderStatus;

const PAGE_SIZE = 10;

const OrdersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [page, setPage] = useState(1);
  const [paymentFilter, setPaymentFilter] = useState('all');

  const filteredData = useMemo(() => {
    let data = [...DUMMY_ORDERS];

    if (activeTab !== 'all') {
      data = data.filter((order) => order.status === activeTab);
    }

    if (paymentFilter !== 'all') {
      data = data.filter((order) => order.paymentStatus === paymentFilter);
    }

    return data;
  }, [activeTab, paymentFilter]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const paginatedData = filteredData.slice(startIndex, startIndex + PAGE_SIZE);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setPage(1);
  };

  const paymentOptions = [
    { label: 'Semua Pembayaran', value: 'all' },
    { label: 'Lunas', value: 'Paid' },
    { label: 'Menunggu', value: 'Pending' },
    { label: 'Gagal', value: 'Failed' },
  ];

  const getEmptyMessage = () => {
    switch (activeTab) {
      case 'all':
        return 'Belum ada order.';
      case 'processing':
        return 'Tidak ada order yang diproses.';
      case 'completed':
        return 'Tidak ada order yang selesai.';
      case 'cancelled':
        return 'Tidak ada order yang dibatalkan.';
      default:
        return 'Tidak ada order.';
    }
  };

  const getTabLabel = (tab: TabType) => {
    switch (tab) {
      case 'all':
        return 'Semua';
      case 'processing':
        return 'Diproses';
      case 'completed':
        return 'Selesai';
      case 'cancelled':
        return 'Dibatalkan';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#191c1e]">Pesanan</h1>
          <p className="text-[15px] text-[#737686]">
            Kelola dan lacak semua pesanan marketplace.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-[#e0e3e5]">
          {(['all', 'processing', 'completed', 'cancelled'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-2 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === tab
                  ? 'border-[#004ac6] text-[#004ac6]'
                  : 'border-transparent text-[#737686] hover:text-[#191c1e]'
              }`}
            >
              {getTabLabel(tab)}
            </button>
          ))}
        </div>

        {/* Filter */}
        <FilterBar
          filters={[
            {
              key: 'payment',
              options: paymentOptions,
              value: paymentFilter,
              onChange: (val) => {
                setPaymentFilter(val);
                setPage(1);
              },
            },
          ]}
          onMoreFilters={() => {}}
          moreFiltersLabel="More Filters"
          visibleFilters={1}
        />

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
                  orders={paginatedData}
                  isLoading={false}
                  emptyMessage={getEmptyMessage()}
                />
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 border-t border-[#e0e3e5] pt-4">
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
      </div>
    </AdminLayout>
  );
};

export default OrdersPage;