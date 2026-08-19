import React from 'react';
import { Link } from 'react-router-dom';

import Icon from '../ui/Icon';
import { formatRupiah } from '../../utils/currency';
import type { InventProduct, ProductStatus } from '../../api/invent';

interface ProductsCardItemProps {
  product: InventProduct;
  status: ProductStatus;
  onEdit: () => void;
  onDelete: () => void;
}

const STATUS_CLASS: Record<ProductStatus, string> = {
  Tayang: 'bg-[#e6f4ee] text-[#12805c]',
  'Stok Habis': 'bg-[#FFF0F0] text-[#ba1a1a]',
  Draf: 'bg-[#F5F7FB] text-[#737686]',
};

const ProductsCardItem: React.FC<ProductsCardItemProps> = ({
  product,
  status,
  onEdit,
  onDelete,
}) => {
  const image =
    product.images?.find((img) => img.isPrimary)?.url || product.images?.[0]?.url;

  return (
    <div
      className="
        overflow-hidden rounded-[20px] border border-white/80 bg-white/95
        p-3.5 shadow-[0_6px_18px_rgba(32,36,45,0.05)] backdrop-blur-sm
        transition-all duration-200 hover:-translate-y-0.5
        hover:shadow-[0_10px_26px_rgba(32,36,45,0.08)] sm:p-4
      "
    >
      <div className="flex gap-3">

        <Link
          to={`/products/${product.slug}`}
          className="
            flex h-20 w-20 shrink-0 items-center justify-center
            overflow-hidden rounded-xl bg-[#F5F7FB] ring-1 ring-[#e0e3e5]
            sm:h-24 sm:w-24
          "
        >
          {image ? (
            <img
              src={image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <Icon name="product" size={24} className="text-[#A2A8B3]" />
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <Link to={`/products/${product.slug}`}>
            <p className="line-clamp-2 text-[13px] font-bold leading-snug text-[#101319] transition-colors hover:text-[#4077a6] sm:text-[14px]">
              {product.name}
            </p>
          </Link>

          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <span
              className={`
                inline-flex items-center rounded-full px-2 py-0.5 text-[9px]
                font-semibold uppercase tracking-wider
                ${STATUS_CLASS[status]}
              `}
            >
              {status}
            </span>
            {product.category?.name && (
              <span className="truncate text-[10px] text-[#A2A8B3]">
                {product.category.name}
              </span>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-[13px] font-bold text-[#4077a6] tabular-nums sm:text-[14px]">
              {formatRupiah(Number(product.price))}
            </span>
            <span className="h-1 w-1 shrink-0 rounded-full bg-[#e0e3e5]" />
            <span
              className={`
                inline-flex items-center gap-1 text-[11px] font-semibold
                tabular-nums
                ${
                  product.stock === 0
                    ? 'text-[#ba1a1a]'
                    : product.stock < 10
                      ? 'text-[#B45309]'
                      : 'text-[#737686]'
                }
              `}
            >
              <span
                className={`
                  h-1 w-1 rounded-full
                  ${
                    product.stock === 0
                      ? 'bg-[#ba1a1a]'
                      : product.stock < 10
                        ? 'bg-[#FFD500]'
                        : 'bg-[#12805c]'
                  }
                `}
              />
              {product.stock} stok
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex gap-2 border-t border-[#F5F7FB] pt-3">
        <button
          type="button"
          onClick={onEdit}
          className="
            flex flex-1 items-center justify-center gap-1.5 rounded-full
            border border-[#e0e3e5] bg-white py-2 text-[11px] font-semibold
            text-[#101319] transition-all duration-200 hover:border-[#538cbd]
            hover:text-[#4077a6] active:scale-[0.98]
          "
        >
          <Icon name="edit" size={12} />
          Edit
        </button>

        <Link
          to={`/products/${product.slug}`}
          className="
            flex flex-1 items-center justify-center gap-1.5 rounded-full
            border border-[#e0e3e5] bg-white py-2 text-[11px] font-semibold
            text-[#101319] transition-all duration-200 hover:border-[#538cbd]
            hover:text-[#4077a6] active:scale-[0.98]
          "
        >
          <Icon name="eye" size={12} />
          Lihat
        </Link>

        <button
          type="button"
          onClick={onDelete}
          className="
            flex h-9 w-9 shrink-0 items-center justify-center rounded-full
            border border-[#e0e3e5] bg-white text-[#A2A8B3] transition-all
            duration-200 hover:border-[#ba1a1a]/40 hover:bg-[#FFF0F0]
            hover:text-[#ba1a1a] active:scale-[0.95]
          "
          aria-label="Hapus produk"
        >
          <Icon name="trash" size={13} />
        </button>
      </div>
    </div>
  );
};

export default ProductsCardItem;