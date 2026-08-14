// src/pages/admin/WithdrawalsPage.tsx
import React, { useCallback, useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import FilterBar from '../../components/ui/filter/FilterBar';
import Pagination from '../../components/ui/Pagination';
import WithdrawalTable from './components/TableWithdrawals';
import {
  decideWithdrawal,
  getWithdrawals,
  type AdminWithdrawal,
  type WithdrawalStatus,
} from '../../api/admin';

const PAGE_SIZE = 10;

/**
 * Filter pencarian belum ada di sini: backend memfilter penarikan berdasarkan
 * status saja, dan menyaring hasil satu halaman di client akan menyembunyikan
 * penarikan yang cocok di halaman lain.
 */
const WithdrawalsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const [items, setItems] = useState<AdminWithdrawal[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const load = useCallback(() => {
    setIsLoading(true);
    setError(null);
    return getWithdrawals({
      status: (statusFilter || undefined) as WithdrawalStatus | undefined,
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
  }, [statusFilter, page]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleAction = async (id: string, action: 'APPROVE' | 'REJECT') => {
    // Menolak berarti mengembalikan uang ke penjual — jangan sampai kepencet.
    if (
      action === 'REJECT' &&
      !window.confirm('Tolak penarikan ini? Saldo penjual bakal dikembalikan.')
    ) {
      return;
    }
    setPendingId(id);
    try {
      await decideWithdrawal(id, action);
      await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setPendingId(null);
    }
  };

  const statusOptions = [
    { label: 'Semua Status', value: '' },
    { label: 'Menunggu', value: 'PENDING' },
    { label: 'Ditransfer', value: 'SUCCESS' },
    { label: 'Ditolak', value: 'FAILED' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#191c1e]">Penarikan Saldo</h1>
          <p className="text-[15px] text-[#737686]">
            Tinjau dan proses permintaan penarikan saldo penjual.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
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
            visibleFilters={1}
          />
        </div>

        {error && (
          <div className="rounded-2xl border border-[#ffcdd2] bg-[#fff5f5] p-4 text-[13px] text-[#a33131]">
            {error}
          </div>
        )}

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
                  withdrawals={items}
                  isLoading={isLoading}
                  emptyMessage={
                    statusFilter
                      ? 'Nggak ada penarikan dengan status ini.'
                      : 'Belum ada permintaan penarikan.'
                  }
                  onAction={(id, action) => void handleAction(id, action)}
                  pendingId={pendingId}
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

export default WithdrawalsPage;
