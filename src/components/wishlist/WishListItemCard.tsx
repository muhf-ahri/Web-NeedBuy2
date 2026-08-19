import React from 'react';

import Icon from '../ui/Icon';
import { formatRupiah } from '../../utils/currency';
/**
 * Sengaja BUKAN `Product` utuh. Endpoint `/saved-products` hanya mengirim
 * sebagian field, dan menuntut `Product` penuh di sini membuat tipe berbohong
 * soal apa yang benar-benar ada saat runtime.
 */
export interface WishlistCardProduct {
  id: string;
  name: string;
  slug: string;
  price: string;
  stock: number;
  images?: Array<{ url: string; isPrimary?: boolean }>;
  category?: { name: string } | null;
}

interface WishlistItemCardProps {
  product: WishlistCardProduct;
  busy: boolean;
  onOpen: () => void;
  onAddToCart: () => void;
  onRemove: () => void;
}

const WishlistItemCard: React.FC<WishlistItemCardProps> = ({
  product,
  busy,
  onOpen,
  onAddToCart,
  onRemove,
}) => {
  const inStock = product.stock > 0;
  const image =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    '';

  const actions = (extra: string) => (
    <div className={`flex items-center gap-2 ${extra}`}>
      <button
        type="button"
        onClick={onAddToCart}
        disabled={busy || !inStock}
        className="
          flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full
          bg-[#004ac6] px-4 text-[12px] font-semibold text-white
          shadow-[0_4px_12px_rgba(83,140,219,0.25)] transition-all
          duration-200 hover:bg-[#004ac6] active:scale-[0.98]
          disabled:cursor-not-allowed disabled:bg-[#A2A8B3]
          disabled:shadow-none sm:flex-none
        "
      >
        {busy ? (
          <Icon name="clock" size={13} className="animate-spin" />
        ) : (
          <Icon name="cart" size={13} />
        )}
        Keranjang
      </button>

      <button
        type="button"
        onClick={onRemove}
        disabled={busy}
        className="
          flex h-9 w-9 shrink-0 items-center justify-center rounded-full
          border border-[#e0e3e5] bg-white text-[#737686] transition-all
          duration-200 hover:border-[#ba1a1a]/40 hover:bg-[#FFF0F0]
          hover:text-[#ba1a1a] active:scale-[0.95]
          disabled:cursor-not-allowed disabled:opacity-50
        "
        aria-label="Hapus dari wishlist"
      >
        <Icon name="trash" size={15} />
      </button>
    </div>
  );

  return (
    <div
      className="
        group overflow-hidden rounded-[20px] border border-white/80
        bg-white/95 p-3.5 shadow-[0_8px_24px_rgba(32,36,45,0.06)]
        backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5
        hover:shadow-[0_14px_36px_rgba(32,36,45,0.10)] sm:p-4
      "
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onOpen}
          className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#F5F7FB] ring-1 ring-[#e0e3e5] sm:h-20 sm:w-20"
        >
          {image ? (
            <img
              src={image}
              alt={product.name}
              className="
                h-full w-full object-cover transition-transform duration-300
                group-hover:scale-105
              "
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center">
              <Icon name="product" size={20} className="text-[#A2A8B3]" />
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={onOpen}
          className="min-w-0 flex-1 text-left"
        >
          <p
            className="
              truncate text-[13px] font-semibold text-[#101319]
              transition-colors duration-200 group-hover:text-[#004ac6]
              sm:text-[14px]
            "
          >
            {product.name}
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span
              className={`
                inline-flex items-center gap-1 rounded-full px-2 py-0.5
                text-[9px] font-semibold
                ${
                  inStock
                    ? 'bg-[#e6f4ee] text-[#12805c]'
                    : 'bg-[#FFF0F0] text-[#ba1a1a]'
                }
              `}
            >
              <span
                className={`
                  h-1 w-1 rounded-full
                  ${inStock ? 'bg-[#12805c]' : 'bg-[#ba1a1a]'}
                `}
              />
              {inStock ? `${product.stock} tersedia` : 'Stok habis'}
            </span>
            {product.category?.name && (
              <span className="truncate text-[10px] text-[#A2A8B3]">
                {product.category.name}
              </span>
            )}
          </div>

          <p className="mt-1 text-[14px] font-bold text-[#004ac6] sm:hidden">
            {formatRupiah(product.price)}
          </p>
        </button>

        <p className="hidden shrink-0 text-[14px] font-bold text-[#004ac6] sm:block">
          {formatRupiah(product.price)}
        </p>

        {actions('hidden sm:flex')}
      </div>

      {actions('mt-3 sm:hidden')}
    </div>
  );
};

export default WishlistItemCard;