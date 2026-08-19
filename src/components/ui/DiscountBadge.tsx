import React from 'react';
import { formatRupiah } from '../../utils/currency';

export const strikePrice = (price: string | number, discountPercent: number): number =>
  Math.round(Number(price) / (1 - discountPercent / 100));

export const DiscountChip: React.FC<{ discountPercent: number; className?: string }> = ({
  discountPercent,
  className = '',
}) =>
  discountPercent > 0 ? (
    <span
      className={`shrink-0 rounded-full bg-[#ffdad6] px-1.5 py-0.5 text-[10px] font-bold leading-none text-[#93000a] ${className}`}
    >
      -{discountPercent}%
    </span>
  ) : null;

export const PriceWithDiscount: React.FC<{
  price: string;
  discountPercent: number;
  className?: string;
}> = ({ price, discountPercent, className = '' }) => {
  const onSale = discountPercent > 0;

  return (
    <div className={`min-w-0 ${className}`}>
      <span className="block truncate text-[14px] font-bold text-[#004ac6]">
        {formatRupiah(price)}
      </span>
      {onSale && (
        <span className="mt-0.5 flex items-center gap-1.5 truncate text-[11px] leading-none">
          <span className="text-[#737686] line-through">
            {formatRupiah(strikePrice(price, discountPercent))}
          </span>
          <DiscountChip discountPercent={discountPercent} />
        </span>
      )}
    </div>
  );
};

const DiscountBadge: React.FC<{
  discountPercent: number;
  price: string;
  className?: string;
}> = ({ discountPercent, price, className = '' }) => {
  if (!discountPercent || discountPercent <= 0) return null;

  const before = strikePrice(price, discountPercent);
  const saved = before - Number(price);

  return (
    <div className={`absolute top-2 left-2 z-10 group/disc ${className}`}>
      <span className="block rounded-full bg-[#ba1a1a] px-2 py-0.5 text-[10px] font-bold text-white shadow-md ring-1 ring-white/30 transition-transform duration-200 group-hover/disc:scale-105">
        -{discountPercent}%
      </span>

      <span
        className="pointer-events-none absolute left-0 top-full mt-1.5 w-max max-w-[11rem] rounded-lg bg-[#101319] px-2.5 py-1.5 text-[11px] leading-tight text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover/disc:opacity-100"
        role="note"
      >
        <span className="block text-white/60 line-through">{formatRupiah(before)}</span>
        <span className="block font-semibold text-[#7fe8b2]">Hemat {formatRupiah(saved)}</span>
      </span>
    </div>
  );
};

export default DiscountBadge;
