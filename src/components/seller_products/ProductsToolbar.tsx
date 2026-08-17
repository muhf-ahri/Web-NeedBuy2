import React from 'react';

import Icon from '../ui/Icon';
import Button from '../ui/Button';

interface ProductsToolbarProps {
  search: string;
  onSearchChange: (v: string) => void;
  onAddNew: () => void;
  totalProducts: number;
  loading: boolean;
}

const ProductsToolbar: React.FC<ProductsToolbarProps> = ({
  search,
  onSearchChange,
  onAddNew,
  totalProducts,
  loading,
}) => (
  <div
    className="
      flex flex-wrap items-center justify-between gap-3 rounded-[20px]
      border border-white/80 bg-white/95 p-3
      shadow-[0_6px_18px_rgba(32,36,45,0.05)] backdrop-blur-sm sm:p-4
    "
  >
    {/* Search */}
    <div className="relative min-w-0 flex-1">
      <Icon
        name="search"
        size={16}
        className="
          pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2
          text-[#A2A8B3]
        "
      />
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Cari produk..."
        className="
          w-full rounded-full border border-[#E8ECF4] bg-[#F5F7FB] py-2.5
          pl-10 pr-10 text-[13px] text-[#20242D] outline-none
          placeholder:text-[#A2A8B3] transition-all duration-200
          focus:border-[#538CDB] focus:bg-white
          focus:shadow-[0_4px_14px_rgba(83,140,219,0.10)]
        "
      />
      {search && (
        <button
          type="button"
          onClick={() => onSearchChange('')}
          className="
            absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2
            items-center justify-center rounded-full text-[#A2A8B3]
            transition-colors hover:bg-white hover:text-[#20242D]
          "
          aria-label="Hapus pencarian"
        >
          <Icon name="close" size={14} />
        </button>
      )}
    </div>

    {/* Info count + tombol tambah mobile */}
    <div className="flex items-center gap-2 sm:gap-3">
      <p className="text-[11px] text-[#737A87] sm:text-[12px]">
        {loading ? 'Memuat...' : (
          <span>
            <span className="font-bold text-[#20242D] tabular-nums">
              {totalProducts}
            </span>{' '}
            produk
          </span>
        )}
      </p>

      <Button
        variant="primary"
        onClick={onAddNew}
        className="
          inline-flex h-10 items-center gap-1.5 rounded-full bg-[#538CDB]
          px-4 text-[12px] font-semibold text-white
          shadow-[0_6px_16px_rgba(83,140,219,0.25)] transition-all
          hover:bg-[#467BC7] hover:shadow-[0_8px_20px_rgba(83,140,219,0.30)]
          active:scale-[0.99] lg:hidden
        "
      >
        <Icon name="plus" size={14} className="text-white" />
        <span className="hidden sm:inline">Tambah Produk</span>
      </Button>
    </div>
  </div>
);

export default ProductsToolbar;