// src/pages/admin/ReportsPage.tsx
import React, { useState, useMemo } from 'react';
import AdminLayout from './AdminLayout';
import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';
import FilterBar from '../../components/ui/filter/FilterBar';
import Pagination from '../../components/ui/Pagination';
import ReportTable from './components/TableReport';
import { DUMMY_REPORTS, type ReportPriority, type ReportStatus } from './data/reportsData';

const PAGE_SIZE = 10;

const ReportsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredData = useMemo(() => {
    let data = [...DUMMY_REPORTS];

    if (statusFilter !== 'all') {
      data = data.filter((report) => report.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      data = data.filter((report) => report.priority === priorityFilter);
    }

    return data;
  }, [statusFilter, priorityFilter]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const paginatedData = filteredData.slice(startIndex, startIndex + PAGE_SIZE);

  const statusOptions = [
    { label: 'Semua Status', value: 'all' },
    { label: 'Terbuka', value: 'Open' },
    { label: 'Diselidiki', value: 'Investigating' },
    { label: 'Selesai', value: 'Resolved' },
  ];

  const priorityOptions = [
    { label: 'Semua Prioritas', value: 'all' },
    { label: 'Tinggi', value: 'High' },
    { label: 'Sedang', value: 'Medium' },
    { label: 'Rendah', value: 'Low' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-[28px] font-bold text-[#191c1e]">Laporan</h1>
          <p className="text-[15px] text-[#737686]">
            Kelola dan selidiki laporan dari pengguna marketplace.
          </p>
        </div>

        {/* Filter + Add Button */}
        <div className="flex flex-wrap items-center justify-between gap-3">
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
            onMoreFilters={() => {}}
            moreFiltersLabel="More Filters"
            visibleFilters={2}
          />

        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-[#e0e3e5] bg-white p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f2f4f6] text-[11px] font-semibold uppercase text-[#737686]">
                  <th className="pb-2 pr-2 text-left">ID Laporan</th>
                  <th className="pb-2 pr-2 text-left">Kategori</th>
                  <th className="pb-2 pr-2 text-left">Pelapor</th>
                  <th className="pb-2 pr-2 text-left">Entitas</th>
                  <th className="pb-2 pr-2 text-left">Prioritas</th>
                  <th className="pb-2 pr-2 text-left">Status</th>
                  <th className="pb-2 pr-2 text-left">Tanggal</th>
                  <th className="pb-2 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f4f6]">
                <ReportTable
                  reports={paginatedData}
                  isLoading={false}
                  emptyMessage="Belum ada laporan."
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

export default ReportsPage;