import React, { useCallback, useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import FilterBar from '../../components/ui/filter/FilterBar';
import Pagination from '../../components/ui/Pagination';
import ReviewTable from './components/TableReview';
import { getReviews, setReviewHidden, type AdminReview } from '../../api/admin';

const PAGE_SIZE = 10;

const ReviewsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [visibility, setVisibility] = useState<'' | 'visible' | 'hidden'>('');
  const [rating, setRating] = useState('');

  const [items, setItems] = useState<AdminReview[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const load = useCallback(() => {
    setIsLoading(true);
    setError(null);
    return getReviews({
      isHidden: visibility === '' ? undefined : visibility === 'hidden',
      rating: rating ? Number(rating) : undefined,
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
  }, [visibility, rating, page]);

  useEffect(() => {
    void load();
  }, [load]);

  const toggleHidden = async (review: AdminReview) => {
    setPendingId(review.id);
    try {
      await setReviewHidden(review.id, !review.isHidden);
      await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setPendingId(null);
    }
  };

  const visibilityOptions = [
    { label: 'Semua Ulasan', value: '' },
    { label: 'Tampil', value: 'visible' },
    { label: 'Disembunyikan', value: 'hidden' },
  ];

  const ratingOptions = [
    { label: 'Semua Rating', value: '' },
    ...[5, 4, 3, 2, 1].map((star) => ({ label: `★ ${star}`, value: String(star) })),
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#191c1e]">Ulasan</h1>
          <p className="text-[15px] text-[#737686]">
            Pantau dan moderasi ulasan pelanggan di semua produk.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <FilterBar
            filters={[
              {
                key: 'visibility',
                options: visibilityOptions,
                value: visibility,
                onChange: (val) => {
                  setVisibility(val as '' | 'visible' | 'hidden');
                  setPage(1);
                },
              },
              {
                key: 'rating',
                options: ratingOptions,
                value: rating,
                onChange: (val) => {
                  setRating(val);
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
                  reviews={items}
                  isLoading={isLoading}
                  emptyMessage={
                    visibility || rating
                      ? 'Nggak ada ulasan yang cocok sama filter ini.'
                      : 'Belum ada ulasan.'
                  }
                  onToggleHidden={(review) => void toggleHidden(review)}
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

export default ReviewsPage;
