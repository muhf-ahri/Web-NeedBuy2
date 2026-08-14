// src/pages/admin/ReportsPage.tsx
import React, { useCallback, useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import FilterBar from '../../components/ui/filter/FilterBar';
import Pagination from '../../components/ui/Pagination';
import ReportTable, { nextStatus } from './components/TableReport';
import {
  getReports,
  updateReport,
  type AdminReport,
  type ReportPriority,
  type ReportStatus,
} from '../../api/admin';

const PAGE_SIZE = 10;

const ReportsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const [items, setItems] = useState<AdminReport[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const load = useCallback(() => {
    setIsLoading(true);
    setError(null);
    return getReports({
      status: (statusFilter || undefined) as ReportStatus | undefined,
      priority: (priorityFilter || undefined) as ReportPriority | undefined,
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
  }, [statusFilter, priorityFilter, page]);

  useEffect(() => {
    void load();
  }, [load]);

  const advance = async (report: AdminReport) => {
    const status = nextStatus[report.status];
    if (!status) return;

    setPendingId(report.id);
    try {
      await updateReport(report.id, { status });
      await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setPendingId(null);
    }
  };

  const statusOptions = [
    { label: 'Semua Status', value: '' },
    { label: 'Terbuka', value: 'OPEN' },
    { label: 'Diselidiki', value: 'INVESTIGATING' },
    { label: 'Selesai', value: 'RESOLVED' },
  ];

  const priorityOptions = [
    { label: 'Semua Prioritas', value: '' },
    { label: 'Tinggi', value: 'HIGH' },
    { label: 'Sedang', value: 'MEDIUM' },
    { label: 'Rendah', value: 'LOW' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#191c1e]">Laporan</h1>
          <p className="text-[15px] text-[#737686]">
            Tindak lanjuti laporan pengguna atas produk, toko, dan ulasan.
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
              {
                key: 'priority',
                options: priorityOptions,
                value: priorityFilter,
                onChange: (val) => {
                  setPriorityFilter(val);
                  setPage(1);
                },
              },
            ]}
            visibleFilters={2}
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
                  <th className="pb-2 pr-2 text-left">ID Laporan</th>
                  <th className="pb-2 pr-2 text-left">Kategori</th>
                  <th className="pb-2 pr-2 text-left">Pelapor</th>
                  <th className="pb-2 pr-2 text-left">Sasaran</th>
                  <th className="pb-2 pr-2 text-left">Prioritas</th>
                  <th className="pb-2 pr-2 text-left">Status</th>
                  <th className="pb-2 pr-2 text-left">Tanggal</th>
                  <th className="pb-2 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f4f6]">
                <ReportTable
                  reports={items}
                  isLoading={isLoading}
                  emptyMessage={
                    statusFilter || priorityFilter
                      ? 'Nggak ada laporan yang cocok sama filter ini.'
                      : 'Belum ada laporan masuk.'
                  }
                  onAdvance={(report) => void advance(report)}
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

export default ReportsPage;
