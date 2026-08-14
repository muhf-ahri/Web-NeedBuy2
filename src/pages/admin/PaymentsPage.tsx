// src/pages/admin/PaymentsPage.tsx
import React, { useState, useMemo } from 'react';
import AdminLayout from './AdminLayout';
import FilterBar from '../../components/ui/filter/FilterBar';
import Pagination from '../../components/ui/Pagination';
import PaymentTable from './components/TablePayments';
import { DUMMY_PAYMENTS, type PaymentStatus, type PaymentMethod } from './data/paymentsData';

const PAGE_SIZE = 10;

const PaymentsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  const filteredData = useMemo(() => {
    let data = [...DUMMY_PAYMENTS];

    if (statusFilter !== 'all') {
      data = data.filter((payment) => payment.status === statusFilter);
    }

    if (methodFilter !== 'all') {
      data = data.filter((payment) => payment.method === methodFilter);
    }

    return data;
  }, [statusFilter, methodFilter]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const paginatedData = filteredData.slice(startIndex, startIndex + PAGE_SIZE);

  const statusOptions = [
    { label: 'Semua Status', value: 'all' },
    { label: 'Berhasil', value: 'Paid' },
    { label: 'Menunggu', value: 'Pending' },
    { label: 'Gagal', value: 'Failed' },
    { label: 'Dikembalikan', value: 'Refunded' },
  ];

  const methodOptions = [
    { label: 'Semua Metode', value: 'all' },
    { label: 'Visa', value: 'Visa' },
    { label: 'Mastercard', value: 'Mastercard' },
    { label: 'Bank Transfer', value: 'Bank Transfer' },
    { label: 'PayPal', value: 'PayPal' },
    { label: 'QRIS', value: 'QRIS' },
    { label: 'E-Wallet', value: 'E-Wallet' },
  ];

  const getEmptyMessage = () => {
    if (statusFilter !== 'all' && methodFilter !== 'all') {
      return 'Tidak ada transaksi dengan filter ini.';
    }
    return 'Belum ada transaksi pembayaran.';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-[28px] font-bold text-[#191c1e]">Pembayaran</h1>
          <p className="text-[15px] text-[#737686]">
            Kelola dan lacak semua transaksi pembayaran pelanggan.
          </p>
        </div>

        {/* Filter */}
        <FilterBar
          filters={[
            {
              key: 'status',
              options: statusOptions,
              value: statusFilter,
              onChange: (val) => {
                setStatusFilter(val);
                setPage(1);
              },
            },
            {
              key: 'method',
              options: methodOptions,
              value: methodFilter,
              onChange: (val) => {
                setMethodFilter(val);
                setPage(1);
              },
            },
          ]}
          onMoreFilters={() => {}}
          moreFiltersLabel="More Filters"
          visibleFilters={2}
        />

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-[#e0e3e5] bg-white p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f2f4f6] text-[11px] font-semibold uppercase text-[#737686]">
                  <th className="pb-2 pr-2 text-left">ID Transaksi</th>
                  <th className="pb-2 pr-2 text-left">ID Order</th>
                  <th className="pb-2 pr-2 text-left">Pembeli</th>
                  <th className="pb-2 pr-2 text-left">Jumlah</th>
                  <th className="pb-2 pr-2 text-left">Metode</th>
                  <th className="pb-2 pr-2 text-left">Status</th>
                  <th className="pb-2 pr-2 text-left">Tanggal</th>
                  <th className="pb-2 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f4f6]">
                <PaymentTable
                  payments={paginatedData}
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

export default PaymentsPage;