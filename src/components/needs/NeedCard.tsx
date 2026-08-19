import React from 'react';

import Icon from '../ui/Icon';
import RecommendationRow from './RecommendationRow';
import { formatRupiah } from '../../utils/currency';
import type { Need, Recommendation } from '../../api/needs';

// Status ditampilkan pakai bahasa manusia. Sebelumnya enum mentah "DRAFT"
// yang bocor ke layar, dan tidak memberi tahu apa pun soal harus ngapain.
const STATUS_LABEL: Record<string, string> = {
  DRAFT: 'Belum diproses',
  PROCESSING: 'Lagi diproses',
  COMPLETED: 'Siap',
};

const STATUS_STYLE: Record<
  string,
  { bg: string; text: string; dot: string }
> = {
  DRAFT: {
    bg: 'bg-[#FFF7E0]',
    text: 'text-[#B45309]',
    dot: 'bg-[#FFD500]',
  },
  PROCESSING: {
    bg: 'bg-[#538cbd]/15',
    text: 'text-[#4077a6]',
    dot: 'bg-[#4077a6]',
  },
  COMPLETED: {
    bg: 'bg-[#e6f4ee]',
    text: 'text-[#12805c]',
    dot: 'bg-[#12805c]',
  },
};

interface NeedCardProps {
  need: Need;
  isActive: boolean;
  recs: Recommendation[];
  recLoading: boolean;
  busyId: string | null;
  onOpenRecommendations: (needId: string) => void;
  onMakePlan: (need: Need) => void;
  onOpenProduct: (slug: string) => void;
  onAddToCart: (e: React.MouseEvent, productId: string) => void;
}

const NeedCard: React.FC<NeedCardProps> = ({
  need,
  isActive,
  recs,
  recLoading,
  busyId,
  onOpenRecommendations,
  onMakePlan,
  onOpenProduct,
  onAddToCart,
}) => {
  const status = STATUS_STYLE[need.status] ?? STATUS_STYLE.DRAFT;
  const isDraft = need.status === 'DRAFT';
  const isProcessing = need.status === 'PROCESSING';
  const isReady = need.status === 'COMPLETED';

  return (
    <div
      className="
        overflow-hidden rounded-[24px] border border-white/80 bg-white/95
        p-5 shadow-[0_8px_24px_rgba(32,36,45,0.06)] backdrop-blur-sm
        transition-all duration-200 hover:shadow-[0_14px_36px_rgba(32,36,45,0.10)]
      "
    >
      <div className="flex flex-wrap items-start justify-between gap-3">

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p
              className="
                line-clamp-2 text-[14px] font-semibold text-[#101319]
              "
            >
              {need.rawInput}
            </p>
            <span
              className={`
                inline-flex shrink-0 items-center gap-1 rounded-full px-2
                py-0.5 text-[10px] font-semibold ${status.bg} ${status.text}
              `}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
              {STATUS_LABEL[need.status] ?? 'Belum diproses'}
            </span>
          </div>

          <p className="mt-1 line-clamp-1 text-[12px] text-[#737686]">
            {need.goal ?? 'Belum dianalisis'}
            {need.budget ? (
              <>
                <span className="mx-1.5 text-[#e0e3e5]">·</span>
                Budget{' '}
                <span className="font-semibold text-[#101319]">
                  {formatRupiah(need.budget)}
                </span>
              </>
            ) : null}
            {need.location ? (
              <>
                <span className="mx-1.5 text-[#e0e3e5]">·</span>
                {need.location}
              </>
            ) : null}
          </p>

          {isDraft && (
            <p className="mt-1.5 text-[12px] text-[#B45309]">
              Kebutuhan ini belum dicarikan barang. Tekan Rekomendasi buat mulai.
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onOpenRecommendations(need.id)}
            // Justru dari sinilah status DRAFT diselesaikan. Dulu tombol ini
            // dimatikan saat DRAFT, jadi kebutuhannya terkunci selamanya:
            // satu-satunya jalan keluar ikut terkunci.
            disabled={isProcessing}
            className="
              flex h-9 items-center gap-1.5 rounded-full bg-[#4077a6] px-4
              text-[12px] font-semibold text-white
              shadow-[0_4px_12px_rgba(83,140,219,0.25)] transition-all
              duration-200 hover:bg-[#4077a6] active:scale-[0.98]
              disabled:cursor-not-allowed disabled:bg-[#A2A8B3]
              disabled:shadow-none
            "
          >
            <Icon name="zap" size={13} />
            Rekomendasi
          </button>
          <button
            type="button"
            onClick={() => onMakePlan(need)}
            disabled={!isReady || busyId === `plan-${need.id}`}
            className="
              flex h-9 items-center gap-1.5 rounded-full border
              border-[#538cbd] bg-white px-4 text-[12px] font-semibold
              text-[#4077a6] transition-all duration-200 hover:bg-[#4077a6]
              hover:text-white active:scale-[0.98]
              disabled:cursor-not-allowed disabled:opacity-50
            "
          >
            {busyId === `plan-${need.id}` ? (
              <Icon name="clock" size={12} className="animate-spin" />
            ) : (
              <Icon name="plan" size={12} />
            )}
            Jadikan Rencana
          </button>
        </div>
      </div>

      {isActive && (
        <div className="mt-4 border-t border-[#e0e3e5] pt-4">
          <div className="mb-3 flex items-center gap-2">
            <span
              className="
                flex h-6 w-6 items-center justify-center rounded-lg
                bg-[#538cbd]/10
              "
            >
              <Icon name="layers" size={12} className="text-[#4077a6]" />
            </span>
            <p className="text-[12px] font-bold text-[#101319]">
              Rekomendasi Produk
            </p>
            <span className="text-[11px] text-[#A2A8B3]">
              ({recs.length} hasil)
            </span>
          </div>

          {recLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="
                    flex animate-pulse items-center gap-3 rounded-2xl
                    bg-[#F5F7FB] p-3
                  "
                >
                  <div className="h-16 w-16 shrink-0 rounded-xl bg-[#e0e3e5]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-2.5 w-20 rounded-full bg-[#e0e3e5]" />
                    <div className="h-3 w-3/4 rounded-full bg-[#e0e3e5]" />
                    <div className="h-2.5 w-1/2 rounded-full bg-[#e0e3e5]" />
                  </div>
                </div>
              ))}
            </div>
          ) : recs.length === 0 ? (
            <div
              className="
                rounded-2xl border border-dashed border-[#e0e3e5]
                bg-white/70 py-10 text-center
              "
            >
              <div
                className="
                  mx-auto flex h-11 w-11 items-center justify-center
                  rounded-full bg-[#F5F7FB]
                "
              >
                <Icon name="product" size={18} className="text-[#A2A8B3]" />
              </div>
              <p className="mt-3 text-[13px] font-semibold text-[#101319]">
                Belum ada rekomendasi
              </p>
              <p className="mt-1 text-[11px] text-[#737686]">
                Proses kebutuhan ini dulu supaya AI bisa mencarikan produk
                yang pas.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {recs.map((rec) => (
                <RecommendationRow
                  key={rec.id}
                  rec={rec}
                  onOpen={() => onOpenProduct(rec.product.slug)}
                  onAddToCart={onAddToCart}
                  busy={busyId === rec.product.id}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NeedCard;