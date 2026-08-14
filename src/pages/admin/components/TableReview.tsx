// src/pages/admin/components/ReviewTable.tsx
import React from 'react';
import Icon from '../../../components/ui/Icon';
import type { Review, ReviewStatus } from '../data/reviewsData';

interface ReviewTableProps {
  reviews: Review[];
  isLoading?: boolean;
  emptyMessage?: string;
}

const statusColor: Record<ReviewStatus, string> = {
  Published: 'bg-[#d7f5dc] text-[#156b32]',
  Hidden: 'bg-[#f2f4f6] text-[#737686]',
  Reported: 'bg-[#ffe0e0] text-[#a33131]',
};

const statusLabel: Record<ReviewStatus, string> = {
  Published: 'Dipublikasikan',
  Hidden: 'Disembunyikan',
  Reported: 'Dilaporkan',
};

const ratingStars = (rating: number) => {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Icon
          key={star}
          name="star"
          size={14}
          className={star <= rating ? 'text-[#f59e0b]' : 'text-[#e0e3e5]'}
        />
      ))}
    </span>
  );
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const TableReview: React.FC<ReviewTableProps> = ({
  reviews,
  isLoading = false,
  emptyMessage = 'Tidak ada ulasan.',
}) => {
  if (isLoading) {
    return (
      <tr>
        <td colSpan={6} className="py-10 text-center text-[#737686]">
          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-[#004ac6] border-t-transparent" />
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
        <tr key={review.id} className="text-[13px] transition-colors hover:bg-[#f8f9fb]">
          <td className="py-2.5 pr-2">
            <div className="font-medium text-[#191c1e]">{review.productName}</div>
            <div className="text-[11px] text-[#737686]">{review.productCategory}</div>
          </td>
          <td className="py-2.5 pr-2">
            <div className="flex items-center gap-1">
              {ratingStars(review.rating)}
            </div>
            <div className="mt-0.5 flex items-center gap-1 text-[11px] text-[#737686]">
              <span>{review.reviewerName}</span>
              {review.isVerified && (
                <span className="rounded-full bg-[#dbe1ff] px-1.5 py-0.5 text-[9px] font-semibold text-[#004ac6]">
                  Verifikasi
                </span>
              )}
            </div>
          </td>
          <td className="py-2.5 pr-2">
            <div className="max-w-[200px] truncate text-[#434655]">
              {review.comment}
            </div>
          </td>
          <td className="py-2.5 pr-2">
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusColor[review.status]}`}
            >
              {statusLabel[review.status]}
            </span>
          </td>
          <td className="py-2.5 pr-2 text-[#737686]">{formatDate(review.createdAt)}</td>
          <td className="py-2.5">
            <div className="flex items-center gap-1">
              <button
                className="rounded-lg p-1.5 text-[#737686] transition-colors hover:bg-[#f2f4f6] hover:text-[#004ac6]"
                aria-label="Lihat detail ulasan"
              >
                <Icon name="eye" size={16} />
              </button>
              {review.status === 'Reported' && (
                <button
                  className="rounded-lg p-1.5 text-[#737686] transition-colors hover:bg-[#ffe0e0] hover:text-[#ba1a1a]"
                  aria-label="Hapus ulasan"
                >
                  <Icon name="trash" size={16} />
                </button>
              )}
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

export default TableReview;