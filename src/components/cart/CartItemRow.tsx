import React from 'react';

import Icon from '../ui/Icon';
import { formatRupiah } from '../../utils/currency';
import type { Cart } from '../../api/cart';

export type CartItem = Cart['items'][number];

interface CartItemRowProps {
  item: CartItem;
  unavailable: boolean;
  selected: boolean;
  busy: boolean;
  onToggleSelect: (checked: boolean) => void;
  onQty: (quantity: number) => void;
  onRemove: () => void;
}

const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  unavailable,
  selected,
  busy,
  onToggleSelect,
  onQty,
  onRemove,
}) => {
  const image =
    item.product.images?.find((img) => img.isPrimary)?.url ||
    item.product.images?.[0]?.url ||
    '';

  return (
    <div
      className={`
        flex flex-col gap-3 border-b border-[#F5F7FB] py-4 last:border-0
        sm:flex-row sm:items-center sm:justify-between
        ${unavailable ? 'opacity-60' : ''}
      `}
    >
      <div className="flex min-w-0 items-start gap-3">
        <input
          type="checkbox"
          checked={selected}
          disabled={unavailable}
          onChange={(e) => onToggleSelect(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[#4077a6] disabled:cursor-not-allowed"
          aria-label={`Pilih ${item.product.name} untuk checkout`}
        />

        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#F5F7FB] ring-1 ring-[#e0e3e5] sm:h-[72px] sm:w-[72px]">
          {image ? (
            <img src={image} alt={item.product.name} className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center">
              <Icon name="product" size={20} className="text-[#A2A8B3]" />
            </span>
          )}
        </div>

        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold leading-tight text-[#101319] sm:text-[14px]">
            {item.product.name}
          </p>
          <p className="mt-0.5 truncate text-[11px] text-[#737686]">
            {item.product.seller.storeName}
          </p>
          {item.variant && (
            <p className="text-[11px] text-[#737686]">Model: {item.variant}</p>
          )}
          <p className="mt-0.5 text-[12px] font-semibold text-[#4077a6]">
            {formatRupiah(item.priceAtAdd)}
          </p>

          {item.bulkDiscountPercent > 0 && (
            <span
              className="
                mt-1 inline-flex items-center gap-1 rounded-full
                bg-[#e6f4ee] px-2 py-0.5 text-[9px] font-semibold
                text-[#12805c]
              "
            >
              <span className="h-1 w-1 rounded-full bg-[#12805c]" />
              Grosir -{item.bulkDiscountPercent}% kepake
            </span>
          )}

          {unavailable && (
            <p className="mt-1 text-[11px] font-medium text-[#ba1a1a]">
              Stoknya nggak cukup: kurangi jumlahnya atau hapus.
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pl-7 sm:justify-end sm:pl-0">
        <div className="flex items-center rounded-full border border-[#e0e3e5] bg-white">
          <button
            type="button"
            onClick={() => onQty(Math.max(1, item.quantity - 1))}
            disabled={busy || item.quantity <= 1}
            className="
              flex h-8 w-8 items-center justify-center rounded-l-full
              text-[#737686] transition-colors hover:bg-[#F5F7FB]
              hover:text-[#4077a6] disabled:cursor-not-allowed
              disabled:opacity-40
            "
            aria-label="Kurangi jumlah"
          >
            <Icon name="minus" size={13} />
          </button>
          <span className="w-9 text-center text-[13px] font-bold text-[#101319]">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => onQty(Math.min(item.product.stock, item.quantity + 1))}
            disabled={busy || item.quantity >= item.product.stock}
            className="
              flex h-8 w-8 items-center justify-center rounded-r-full
              text-[#737686] transition-colors hover:bg-[#F5F7FB]
              hover:text-[#4077a6] disabled:cursor-not-allowed
              disabled:opacity-40
            "
            aria-label="Tambah jumlah"
          >
            <Icon name="plus" size={13} />
          </button>
        </div>

        <span className="w-24 text-right text-[13px] font-bold text-[#101319] sm:text-[14px]">
          {formatRupiah(item.subtotal)}
        </span>

        <button
          type="button"
          onClick={onRemove}
          disabled={busy}
          className="
            flex h-8 w-8 items-center justify-center rounded-full
            border border-[#e0e3e5] bg-white text-[#737686] transition-all
            duration-200 hover:border-[#ba1a1a]/40 hover:bg-[#FFF0F0]
            hover:text-[#ba1a1a] active:scale-[0.95]
            disabled:cursor-not-allowed disabled:opacity-50
          "
          aria-label="Hapus item"
        >
          <Icon name="trash" size={14} />
        </button>
      </div>
    </div>
  );
};

export default CartItemRow;