
import React, { useEffect, useState } from 'react';
import Icon from './ui/Icon';
import { getProductReviews, type ProductReview, type ReviewMeta } from '../api/reviews';

const PAGE_SIZE = 5;

const Stars: React.FC<{ value: number; size?: number }> = ({ value, size = 14 }) => (
  <span className="inline-flex items-center gap-0.5" aria-label={`${value} dari 5 bintang`}>
    {[1, 2, 3, 4, 5].map((star) => (
      <Icon
        key={star}
        name="star"
        size={size}
        className={star <= Math.round(value) ? 'text-[#f59e0b]' : 'text-[#e0e3e5]'}
      />
    ))}
  </span>
);

const ProductReviews: React.FC<{ productId: string }> = ({ productId }) => {
  const [items, setItems] = useState<ProductReview[]>([]);
  const [meta, setMeta] = useState<ReviewMeta | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getProductReviews(productId, { page, limit: PAGE_SIZE })
      .then(({ items: rows, meta: info }) => {
        if (cancelled) return;
        setItems((prev) => (page === 1 ? rows : [...prev, ...rows]));
        setMeta(info);
      })
      .catch((err: any) => {
        if (!cancelled) setError(err?.message ?? 'Gagal muat ulasan, coba lagi ya');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [productId, page]);

  if (loading && items.length === 0) {
    return (
      <div className="space-y-3">
        <div className="h-6 w-40 animate-pulse rounded bg-[#f2f4f6]" />
        <div className="h-24 animate-pulse rounded-2xl bg-[#f2f4f6]" />
      </div>
    );
  }

  const total = meta?.total ?? 0;

  return (
    <section>
      <h2 className="mb-4 text-[15px] font-bold text-[#191c1e]">Ulasan pembeli</h2>

      {error && <p className="mb-3 text-[13px] text-[#ba1a1a]">{error}</p>}

      {total === 0 ? (
        <p className="rounded-2xl bg-[#f8f9fb] px-4 py-6 text-center text-[13px] text-[#737686]">
          Belum ada ulasan. Ulasan cuma bisa ditulis pembeli yang pesanannya udah selesai.
        </p>
      ) : (
        <>
          {/* Ringkasan: rata-rata + sebaran, dihitung server dari semua ulasan */}
          <div className="mb-6 flex flex-col gap-5 rounded-2xl bg-[#f8f9fb] p-5 sm:flex-row sm:items-center">
            <div className="shrink-0 text-center sm:w-32">
              <p className="text-[40px] font-bold leading-none text-[#191c1e]">
                {(meta?.average ?? 0).toFixed(1)}
              </p>
              <div className="mt-1">
                <Stars value={meta?.average ?? 0} size={16} />
              </div>
              <p className="mt-1 text-[12px] text-[#737686]">{total} ulasan</p>
            </div>

            <div className="flex-1 space-y-1.5">
              {(meta?.breakdown ?? []).map(({ star, count }) => (
                <div key={star} className="flex items-center gap-2 text-[12px]">
                  <span className="w-8 shrink-0 text-[#737686]">{star}★</span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-[#e0e3e5]">
                    <span
                      className="block h-full rounded-full bg-[#f59e0b]"
                      style={{ width: total === 0 ? '0%' : `${(count / total) * 100}%` }}
                    />
                  </span>
                  <span className="w-8 shrink-0 text-right text-[#737686]">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <ul className="divide-y divide-[#f2f4f6]">
            {items.map((review) => (
              <li key={review.id} className="py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dbe1ff] text-[#004ac6]">
                    <Icon name="user" size={16} className="" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-[#191c1e]">
                      {review.user?.name ?? 'Pembeli'}
                    </p>
                    <p className="flex items-center gap-2 text-[11px] text-[#737686]">
                      <Stars value={review.rating} size={12} />
                      {new Date(review.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                {review.orderItem?.variant && (
                  <p className="mt-2 text-[11px] text-[#737686]">
                    Model dibeli: {review.orderItem.variant}
                  </p>
                )}

                {review.comment && (
                  <p className="mt-2 whitespace-pre-wrap text-[13px] leading-relaxed text-[#434655]">
                    {review.comment}
                  </p>
                )}

                {review.media && review.media.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {review.media.map((file) =>
                      file.kind === 'VIDEO' ? (
                        <video
                          key={file.id}
                          src={file.url}
                          controls
                          preload="metadata"
                          className="h-28 w-40 rounded-xl bg-black object-cover"
                        />
                      ) : (
                        <a
                          key={file.id}
                          href={file.url}
                          target="_blank"
                          rel="noreferrer"
                          className="block h-24 w-24 overflow-hidden rounded-xl border border-[#e0e3e5]"
                        >
                          <img
                            src={file.url}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        </a>
                      )
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>

          {meta && page < meta.totalPages && (
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={loading}
              className="mt-4 w-full rounded-full border border-[#c3c6d7] py-2.5 text-[13px] font-semibold text-[#434655] transition-colors hover:border-[#004ac6] hover:text-[#004ac6] disabled:opacity-60"
            >
              {loading ? 'Sabar ya...' : 'Lihat ulasan lain'}
            </button>
          )}
        </>
      )}
    </section>
  );
};

export default ProductReviews;
