import React from 'react';

import Icon from '../ui/Icon';
import type { Seller } from '../../api/sellers';

interface StoreCardProps {
  store: Seller;
  onClick: () => void;
  size?: 'sm' | 'lg';
}

const StoreCard: React.FC<StoreCardProps> = ({
  store,
  onClick,
  size = 'sm',
}) => {
  const logoSize = size === 'lg' ? 64 : 48;

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group flex w-full items-start gap-3 overflow-hidden rounded-[20px]
        border border-white/80 bg-white/95 p-4 text-left
        shadow-[0_8px_24px_rgba(32,36,45,0.06)] backdrop-blur-sm
        transition-all duration-200 hover:-translate-y-0.5
        hover:shadow-[0_14px_36px_rgba(32,36,45,0.10)]
      "
    >
      {/* Logo toko */}
      <div
        className="
          shrink-0 overflow-hidden rounded-xl bg-[#F5F7FB] ring-1
          ring-[#E8ECF4]
        "
        style={{ width: logoSize, height: logoSize }}
      >
        {store.logoUrl ? (
          <img
            src={store.logoUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span
            className="
              flex h-full w-full items-center justify-center font-bold
              text-[#538CDB]
            "
            style={{ fontSize: logoSize / 2.6 }}
          >
            {store.storeName.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className="
              truncate text-[13px] font-semibold text-[#20242D]
              transition-colors duration-200 group-hover:text-[#538CDB]
            "
          >
            {store.storeName}
          </span>
          {store.vacationMode && (
            <span
              className="
                inline-flex items-center gap-1 rounded-full bg-[#FFF7E0]
                px-1.5 py-0.5 text-[9px] font-semibold text-[#B45309]
              "
            >
              <span className="h-1 w-1 rounded-full bg-[#B45309]" />
              Libur
            </span>
          )}
        </div>

        <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-[#737A87]">
          {store.description || 'Toko ini belum nulis deskripsi.'}
        </p>

        <div className="mt-1.5 flex items-center gap-2 text-[11px] text-[#737A87]">
          <span className="inline-flex items-center gap-0.5">
            <Icon name="star" size={11} className="text-[#FFD500]" />
            {Number(store.rating).toFixed(1)}
          </span>
          <span className="h-1 w-1 shrink-0 rounded-full bg-[#D8DEE9]" />
          <span>{store._count?.products ?? 0} produk</span>
        </div>
      </div>

      <Icon
        name="chevronRight"
        size={15}
        className="
          shrink-0 text-[#A2A8B3] transition-all duration-200
          group-hover:translate-x-0.5 group-hover:text-[#538CDB]
        "
      />
    </button>
  );
};

export default StoreCard;