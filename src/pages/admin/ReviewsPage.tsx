// src/pages/admin/ReviewsPage.tsx
import React, { useState, useMemo } from 'react';
import AdminLayout from './AdminLayout';
import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';
import FilterBar from '../../components/ui/filter/FilterBar';
import Pagination from '../../components/ui/Pagination';
import ReviewTable from './components/TableReview';
import { DUMMY_REVIEWS, type ReviewStatus } from './data/reviewsData';

const PAGE_SIZE = 10;

const ReviewsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredData = useMemo(() => {
    let data = [...DUMMY_REVIEWS];

    if (statusFilter !== 'all') {
      data = data.filter((review) => review.status === statusFilter);
    }

    return data;
  }, [statusFilter]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const paginatedData = filteredData.slice(startIndex, startIndex + PAGE_SIZE);

  const statusOptions = [
    { label: 'Semua Status', value: 'all' },
    { label: 'Dipublikasikan', value: 'Published' },
    { label: 'Disembunyikan', value: 'Hidden' },
    { label: 'Dilaporkan', value: 'Reported' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-[28px] font-bold text-[#191c1e]">Ulasan</h1>
          <p className="text-[15px] text-[#737686]">
            Kelola dan pantau ulasan pelanggan di semua produk.
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
                  <th className="pb-2 pr-2 text-left">Produk</th>
                  <th className="pb-2 pr-2 text-left">Ulasan</th>
                  <th className="pb-2 pr-2 text-left">Komentar</th>
                  <th className="pb-2 pr-2 text-left">Status</th>
                  <th className="pb-2 pr-2 text-left">Tanggal</th>
                  <th className="pb-2 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f4f6]">
                <ReviewTable
                  reviews={paginatedData}
                  isLoading={false}
                  emptyMessage="Belum ada ulasan."
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

export default ReviewsPage;