import React from 'react';

import Icon from '../ui/Icon';
import { formatRupiah } from '../../utils/currency';
import type { Recommendation } from '../../api/needs';

const LABEL_STYLE: Record<
  Recommendation['label'],
  { label: string; bg: string; text: string }
> = {
  BEST_MATCH: {
    label: 'Paling Cocok',
    bg: 'bg-[#538CDB]',
    text: 'text-white',
  },
  GOOD_MATCH: {
    label: 'Cocok',
    bg: 'bg-[#538CDB]/15',
    text: 'text-[#538CDB]',
  },
  ALTERNATIVE: {
    label: 'Alternatif',
    bg: 'bg-[#F5F7FB]',
    text: 'text-[#737A87]',
  },
};

interface RecommendationRowProps {
  rec: Recommendation;
  onOpen: () => void;
  onAddToCart: (e: React.MouseEvent, productId: string) => void;
  busy: boolean;
}

const RecommendationRow: React.FC<RecommendationRowProps> = ({
  rec,
  onOpen,
  onAddToCart,
  busy,
}) => {
  const style = LABEL_STYLE[rec.label];
  const primaryImage =
    rec.product.images.find((i) => i.isPrimary)?.url ||
    rec.product.images[0]?.url ||
    '';

  return (
    <div
      onClick={onOpen}
      className="
        group flex cursor-pointer flex-col gap-3 rounded-2xl border
        border-[#E8ECF4] bg-white p-3 transition-all duration-200
        hover:border-[#538CDB]/40
        hover:shadow-[0_6px_18px_rgba(83,140,219,0.10)] sm:flex-row
        sm:items-center
      "
    >
      {/* Image */}
      <div
        className="
          relative h-20 w-full shrink-0 overflow-hidden rounded-xl
          bg-[#F5F7FB] ring-1 ring-[#E8ECF4] sm:h-16 sm:w-16
        "
      >
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={rec.product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Icon name="product" size={20} className="text-[#A2A8B3]" />
          </div>
        )}

        {/* Match score badge */}
        <span
          className="
            absolute left-1.5 top-1.5 rounded-full bg-[#20242D]/85 px-1.5
            py-0.5 text-[9px] font-bold text-white backdrop-blur-sm
          "
        >
          {rec.matchScore}%
        </span>
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={`
              inline-flex items-center gap-1 rounded-full px-2 py-0.5
              text-[9px] font-bold uppercase tracking-wider
              ${style.bg} ${style.text}
            `}
          >
            {rec.label === 'BEST_MATCH' && (
              <span className="h-1 w-1 rounded-full bg-[#FFD500]" />
            )}
            {style.label}
          </span>
          <span className="text-[10px] font-medium text-[#A2A8B3]">
            #{rec.ranking}
          </span>
        </div>

        <p
          className="
            mt-1 truncate text-[13px] font-semibold text-[#20242D]
            transition-colors duration-200 group-hover:text-[#538CDB]
          "
        >
          {rec.product.name}
        </p>

        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-[#737A87]">
          <span className="inline-flex items-center gap-0.5">
            <Icon name="star" size={11} className="text-[#FFD500]" />
            {Number(rec.product.rating).toFixed(1)}
          </span>
          <span className="h-1 w-1 shrink-0 rounded-full bg-[#D8DEE9]" />
          <span className="truncate">{rec.product.seller?.storeName ?? 'Toko'}</span>
        </div>
      </div>

      {/* Price + Cart */}
      <div className="flex items-center justify-between gap-2 sm:flex-col sm:items-end sm:justify-center">
        <p className="text-[14px] font-bold text-[#538CDB]">
          {formatRupiah(rec.product.price)}
        </p>
        <button
          type="button"
          onClick={(e) => onAddToCart(e, rec.product.id)}
          disabled={busy}
          className="
            flex h-8 items-center gap-1.5 rounded-full bg-[#538CDB] px-3
            text-[11px] font-semibold text-white
            shadow-[0_4px_12px_rgba(83,140,219,0.25)] transition-all
            duration-200 hover:bg-[#467BC7] active:scale-[0.97]
            disabled:cursor-not-allowed disabled:bg-[#A2A8B3]
            disabled:shadow-none
          "
        >
          {busy ? (
            <Icon name="clock" size={11} className="animate-spin" />
          ) : (
            <Icon name="cart" size={11} />
          )}
          Keranjang
        </button>
      </div>
    </div>
  );
};

export default RecommendationRow;