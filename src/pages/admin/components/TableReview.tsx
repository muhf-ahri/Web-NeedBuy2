import React from 'react';
import Icon from '../../../components/ui/Icon';
import type { AdminReview } from '../../../api/admin';

interface ReviewTableProps {
  reviews: AdminReview[];
  isLoading?: boolean;
  emptyMessage?: string;
  onToggleHidden?: (review: AdminReview) => void;
  pendingId?: string | null;
}

const ratingStars = (rating: number) => (
  <span className="inline-flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Icon
        key={star}
        name="star"
        size={14}
        className={star <= rating ? 'text-[#ffd500]' : 'text-[#e0e3e5]'}
      />
    ))}
  </span>
);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

const TableReview: React.FC<ReviewTableProps> = ({
  reviews,
  isLoading = false,
  emptyMessage = 'Tidak ada ulasan.',
  onToggleHidden,
  pendingId,
}) => {
  if (isLoading) {
    return (
      <tr>
        <td colSpan={6} className="py-10 text-center text-[#737686]">
          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-[#538cbd] border-t-transparent" />
          <span className="ml-2">Memuat…</span>
        </td>
      </tr>
    );
  }

  if (reviews.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="py-10 text-center text-[#737686]">
          {emptyMessage}
        </td>
      </tr>
    );
  }

  return (
    <>
      {reviews.map((review) => (
        <tr key={review.id} className="text-[13px] transition-colors hover:bg-[#f5f7fb]">
          <td className="py-2.5 pr-2">
            <div className="font-medium text-[#101319]">{review.product.name}</div>
            <div className="text-[11px] text-[#737686]">
              {review.product.category.name} · {review.product.seller.storeName}
            </div>
          </td>
          <td className="py-2.5 pr-2">
            <div className="flex items-center gap-1">{ratingStars(review.rating)}</div>
            <div className="mt-0.5 text-[11px] text-[#737686]">{review.user.name}</div>
          </td>
          <td className="py-2.5 pr-2">
            <div className="max-w-[240px] truncate text-[#434655]">{review.comment ?? 'Tanpa komentar'}</div>
          </td>
          <td className="py-2.5 pr-2">
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                review.isHidden ? 'bg-[#f2f4f6] text-[#737686]' : 'bg-[#e6f4ee] text-[#12805c]'
              }`}
            >
              {review.isHidden ? 'Disembunyikan' : 'Tampil'}
            </span>
          </td>
          <td className="py-2.5 pr-2 text-[#737686]">{formatDate(review.createdAt)}</td>
          <td className="py-2.5">
            <button
              onClick={() => onToggleHidden?.(review)}
              disabled={pendingId === review.id}
              className={`rounded-full px-3 py-1 text-[12px] font-semibold text-white transition-colors disabled:opacity-50 ${
                review.isHidden
                  ? 'bg-[#4077a6] hover:bg-[#284a67]'
                  : 'bg-[#ba1a1a] hover:bg-[#93000a]'
              }`}
            >
              {review.isHidden ? 'Tampilkan' : 'Sembunyikan'}
            </button>
          </td>
        </tr>
      ))}
    </>
  );
};

export default TableReview;
