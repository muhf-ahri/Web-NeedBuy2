// src/pages/admin/WithdrawalsPage.tsx
import React, { useState, useMemo } from 'react';
import AdminLayout from './AdminLayout';
import Icon from '../../components/ui/Icon';
import FilterBar from '../../components/ui/filter/FilterBar';
import Pagination from '../../components/ui/Pagination';
import WithdrawalTable from './components/TableWithdrawals';
import {
  DUMMY_WITHDRAWALS,
  statusLabel,
  type WithdrawalStatus,
  type Withdrawal,
} from './data/withdrawalsData';

const PAGE_SIZE = 10;

const WithdrawalsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter data
  const filteredData = useMemo(() => {
    let data = [...DUMMY_WITHDRAWALS];

    // Filter status
    if (statusFilter !== 'all') {
      data = data.filter((item) => item.status === statusFilter);
    }

    // Filter search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      data = data.filter(
        (item) =>
          item.seller.toLowerCase().includes(term) ||
          item.storeName.toLowerCase().includes(term) ||
          item.withdrawalId.toLowerCase().includes(term)
      );
    }

    return data;
  }, [statusFilter, searchTerm]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const paginatedData = filteredData.slice(startIndex, startIndex + PAGE_SIZE);

  const statusOptions = [
    { label: 'Semua Status', value: 'all' },
    { label: 'Menunggu', value: 'pending' },
    { label: 'Disetujui', value: 'approved' },
    { label: 'Diproses', value: 'processed' },
    { label: 'Ditolak', value: 'rejected' },
  ];

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    // Nanti diintegrasikan dengan API
    console.log(`[Withdrawal] ${action} ${id}`);
    // Untuk demo, kita update state lokal
    const updated = DUMMY_WITHDRAWALS.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          status: action === 'approve' ? ('approved' as WithdrawalStatus) : ('rejected' as WithdrawalStatus),
        };
      }
      return item;
    });
    // Di sini nanti panggil API dan refresh data
    // Untuk dummy, kita bisa trigger re-render dengan setState
    // Tapi karena data dummy static, kita reload halaman atau pindah tab
  };

  const getEmptyMessage = () => {
    if (searchTerm) {
      return `Tidak ada penarikan yang cocok dengan "${searchTerm}".`;
    }
    if (statusFilter !== 'all') {
      return `Tidak ada penarikan dengan status "${statusLabel[statusFilter as WithdrawalStatus]}".`;
    }
    return 'Belum ada permintaan penarikan.';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-[28px] font-bold text-[#191c1e]">Withdrawals</h1>
          <p className="text-[15px] text-[#737686]">
            Tinjau dan proses permintaan penarikan saldo penjual.
          </p>
        </div>

        {/* Filter + Table*/}
        <div className="flex flex-wrap items-center gap-3">
          {/* FilterBar */}
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
            ]}
            onMoreFilters={() => {}}
            moreFiltersLabel="More Filters"
            visibleFilters={1}
          />
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-[#e0e3e5] bg-white p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f2f4f6] text-[11px] font-semibold uppercase text-[#737686]">
                  <th className="pb-2 pr-2 text-left">ID Penarikan</th>
                  <th className="pb-2 pr-2 text-left">Penjual</th>
                  <th className="pb-2 pr-2 text-left">Jumlah</th>
                  <th className="pb-2 pr-2 text-left">Informasi Bank</th>
                  <th className="pb-2 pr-2 text-left">Tanggal Request</th>
                  <th className="pb-2 pr-2 text-left">Status</th>
                  <th className="pb-2 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f4f6]">
                <WithdrawalTable
                  withdrawals={paginatedData}
                  isLoading={false}
                  emptyMessage={getEmptyMessage()}
                  onAction={handleAction}
                />
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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

export default WithdrawalsPage;