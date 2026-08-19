import React from 'react';

import Icon from '../ui/Icon';
import type { Seller } from '../../api/sellers';

interface OpenedStoreHeaderProps {
  store: Seller;
  onClose: () => void;
}

const OpenedStoreHeader: React.FC<OpenedStoreHeaderProps> = ({
  store,
  onClose,
}) => (
  <div
    className="
      mb-6 flex items-start gap-4 rounded-[24px] border border-white/80
      bg-white/95 p-5 shadow-[0_8px_24px_rgba(32,36,45,0.06)]
      backdrop-blur-sm
    "
  >
    
    <div
      className="
        shrink-0 overflow-hidden rounded-2xl bg-[#F5F7FB] ring-1
        ring-[#e0e3e5]
      "
      style={{ width: 64, height: 64 }}
    >
      {store.logoUrl ? (
        <img src={store.logoUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <span
          className="
            flex h-full w-full items-center justify-center text-[26px]
            font-bold text-[#4077a6]
          "
        >
          {store.storeName.charAt(0).toUpperCase()}
        </span>
      )}
    </div>

    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-[18px] font-bold text-[#101319]">
          {store.storeName}
        </h2>
        {store.vacationMode && (
          <span
            className="
              inline-flex items-center gap-1 rounded-full bg-[#FFF7E0]
              px-2 py-0.5 text-[10px] font-semibold text-[#B45309]
            "
          >
            <span className="h-1 w-1 rounded-full bg-[#B45309]" />
            Sedang libur
          </span>
        )}
      </div>

      {store.description && (
        <p className="mt-1 line-clamp-2 text-[13px] text-[#737686]">
          {store.description}
        </p>
      )}

      <div className="mt-1.5 flex items-center gap-2 text-[12px] text-[#737686]">
        <span className="inline-flex items-center gap-0.5">
          <Icon name="star" size={12} className="text-[#FFD500]" />
          {Number(store.rating).toFixed(1)}
        </span>
        <span className="h-1 w-1 shrink-0 rounded-full bg-[#e0e3e5]" />
        <span>{store._count?.products ?? 0} produk</span>
      </div>
    </div>

    <button
      type="button"
      onClick={onClose}
      className="
        shrink-0 rounded-full border border-[#e0e3e5] bg-white px-3 py-1.5
        text-[11px] font-semibold text-[#737686] transition-all
        duration-200 hover:border-[#538cbd] hover:text-[#4077a6]
      "
    >
      Tutup
    </button>
  </div>
);

export default OpenedStoreHeader;