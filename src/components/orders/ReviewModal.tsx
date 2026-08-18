import React, { useEffect } from 'react';

import Icon from '../ui/Icon';
import {
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_VIDEO_TYPES,
} from '../../api/uploads';
import type { Order } from '../../api/orders';

interface ReviewModalProps {
  order: Order;
  rating: number;
  comment: string;
  reviewMedia: Array<{ url: string; kind: 'IMAGE' | 'VIDEO' }>;
  uploadingMedia: boolean;
  busy: boolean;
  onClose: () => void;
  onRatingChange: (n: number) => void;
  onCommentChange: (v: string) => void;
  onPickMedia: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveMedia: (index: number) => void;
  onSubmit: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  order,
  rating,
  comment,
  reviewMedia,
  uploadingMedia,
  busy,
  onClose,
  onRatingChange,
  onCommentChange,
  onPickMedia,
  onRemoveMedia,
  onSubmit,
}) => {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const targetItem = order.items.find((i) => !i.review);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div
        className="absolute inset-0 bg-[#20242D]/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="
          review-modal-enter relative flex w-full max-w-md flex-col
          overflow-hidden rounded-[24px] border border-white/80 bg-white/98
          shadow-[0_18px_50px_rgba(32,36,45,0.20)] backdrop-blur-sm
          max-h-[90vh]
        "
      >

        <div className="flex items-center justify-between border-b border-[#E8ECF4] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span
              className="
                flex h-8 w-8 items-center justify-center rounded-lg
                bg-[#538CDB]/10
              "
            >
              <Icon name="star" size={14} className="text-[#538CDB]" />
            </span>
            <h3 className="text-[15px] font-bold text-[#20242D]">
              Kasih Ulasan
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="
              rounded-full p-1.5 text-[#737A87] transition-colors
              hover:bg-[#F5F7FB] hover:text-[#20242D]
            "
            aria-label="Tutup"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">

          {targetItem && (
            <div
              className="
                mb-4 flex items-center gap-3 rounded-2xl bg-[#F5F7FB] p-3
              "
            >
              <div
                className="
                  flex h-11 w-11 shrink-0 items-center justify-center
                  rounded-xl bg-white ring-1 ring-[#E8ECF4]
                "
              >
                <Icon name="orders" size={18} className="text-[#538CDB]" />
              </div>
              <p className="min-w-0 truncate text-[12px] font-semibold text-[#20242D]">
                {targetItem.productName}
              </p>
            </div>
          )}

          <div className="mb-4">
            <p
              className="
                mb-2 text-[10px] font-bold uppercase tracking-[0.16em]
                text-[#737A87]
              "
            >
              Rating
            </p>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => onRatingChange(n)}
                  className="
                    transition-transform duration-150 hover:scale-110
                    active:scale-95
                  "
                  aria-label={`${n} bintang`}
                >
                  <Icon
                    name="star"
                    size={30}
                    className={`
                      transition-colors
                      ${n <= rating ? 'text-[#FFD500]' : 'text-[#E8ECF4]'}
                    `}
                  />
                </button>
              ))}
              <span className="ml-2 text-[12px] font-semibold text-[#20242D]">
                {rating}/5
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="review-comment"
              className="
                mb-2 block text-[10px] font-bold uppercase tracking-[0.16em]
                text-[#737A87]
              "
            >
              Komentar{' '}
              <span className="normal-case tracking-normal text-[#A2A8B3]">
                (opsional)
              </span>
            </label>
            <textarea
              id="review-comment"
              value={comment}
              onChange={(e) => onCommentChange(e.target.value)}
              placeholder="Bagikan pengalamanmu tentang produk ini..."
              rows={4}
              className="
                w-full resize-none rounded-xl border border-[#E8ECF4]
                bg-[#F5F7FB] px-4 py-3 text-[13px] text-[#20242D]
                outline-none placeholder:text-[#A2A8B3] transition-all
                duration-200 focus:border-[#538CDB] focus:bg-white
                focus:shadow-[0_4px_16px_rgba(83,140,219,0.10)]
              "
            />
          </div>

          <div>
            <p
              className="
                mb-2 text-[10px] font-bold uppercase tracking-[0.16em]
                text-[#737A87]
              "
            >
              Lampiran{' '}
              <span className="normal-case tracking-normal text-[#A2A8B3]">
                (opsional)
              </span>
            </p>

            {reviewMedia.length > 0 && (
              <div className="mb-3 grid grid-cols-5 gap-2">
                {reviewMedia.map((file, index) => (
                  <div
                    key={file.url}
                    className="
                      relative aspect-square overflow-hidden rounded-xl
                      border border-[#E8ECF4] bg-[#F5F7FB]
                    "
                  >
                    {file.kind === 'VIDEO' ? (
                      <span
                        className="
                          flex h-full w-full items-center justify-center
                          bg-[#20242D] text-white
                        "
                      >
                        <Icon name="eye" size={18} />
                      </span>
                    ) : (
                      <img
                        src={file.url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => onRemoveMedia(index)}
                      aria-label="Hapus lampiran"
                      className="
                        absolute right-1 top-1 flex h-5 w-5 items-center
                        justify-center rounded-full bg-[#20242D]/70
                        text-white backdrop-blur-sm transition-colors
                        hover:bg-[#FF4646]
                      "
                    >
                      <Icon name="close" size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <input
              type="file"
              id="review-media"
              multiple
              accept={[...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_VIDEO_TYPES].join(
                ','
              )}
              onChange={onPickMedia}
              className="hidden"
              disabled={uploadingMedia}
            />
            <label
              htmlFor="review-media"
              className="
                inline-flex cursor-pointer items-center gap-2 rounded-full
                border border-[#E8ECF4] bg-white px-4 py-2 text-[12px]
                font-semibold text-[#20242D] transition-all duration-200
                hover:border-[#538CDB] hover:text-[#538CDB]
              "
            >
              <Icon name="upload" size={14} />
              {uploadingMedia ? 'Ngunggah…' : 'Tambah foto/video'}
            </label>
            <p className="mt-1.5 text-[10px] text-[#A2A8B3]">
              Maksimal 5 lampiran. Foto ≤ 3 MB, video ≤ 20 MB.
            </p>
          </div>
        </div>

        <div className="border-t border-[#E8ECF4] bg-white/95 px-5 py-4">
          <button
            type="button"
            onClick={onSubmit}
            disabled={busy || uploadingMedia || !targetItem}
            className="
              flex h-11 w-full items-center justify-center gap-2
              rounded-full bg-[#538CDB] px-6 text-[14px] font-semibold
              text-white shadow-[0_7px_18px_rgba(83,140,219,0.25)]
              transition-all duration-200 hover:bg-[#467BC7]
              hover:shadow-[0_9px_22px_rgba(83,140,219,0.30)]
              active:scale-[0.99] disabled:cursor-not-allowed
              disabled:bg-[#A2A8B3] disabled:shadow-none
            "
          >
            {busy && <Icon name="clock" size={15} className="animate-spin" />}
            Kirim Ulasan
          </button>
        </div>
      </div>

      <style>{`
        @keyframes review-modal-enter {
          0% { opacity: 0; transform: translateY(8px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .review-modal-enter {
          animation: review-modal-enter 0.22s cubic-bezier(0.22, 0.9, 0.35, 1) both;
        }
      `}</style>
    </div>
  );
};

export default ReviewModal;