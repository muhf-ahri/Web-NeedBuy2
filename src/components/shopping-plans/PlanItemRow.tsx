import React from 'react';

import Icon from '../ui/Icon';
import { formatRupiah } from '../../utils/currency';
import type { ShoppingPlanItem } from '../../api/plans';

interface PlanItemRowProps {
  item: ShoppingPlanItem;
  disabled: boolean;
  onQty: (quantity: number) => void;
  onRemove: () => void;
}

const PlanItemRow: React.FC<PlanItemRowProps> = ({
  item,
  disabled,
  onQty,
  onRemove,
}) => {
  const image =
    item.product.images?.find((img) => img.isPrimary)?.url ||
    item.product.images?.[0]?.url ||
    '';

  return (
    <div className="flex items-center gap-3 border-b border-[#F5F7FB] py-3.5 last:border-0">
      
      <div
        className="
          h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#F5F7FB]
          ring-1 ring-[#E8ECF4]
        "
      >
        {image ? (
          <img
            src={image}
            alt={item.product.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.opacity = '0';
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Icon name="product" size={20} className="text-[#A2A8B3]" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold leading-snug text-[#20242D]">
          {item.product.name}
        </p>
        <p className="mt-0.5 text-[11px] text-[#737A87]">
          {item.product.category?.name ?? 'Kategori umum'}
        </p>
        <p className="mt-0.5 text-[11px] font-semibold text-[#538CDB]">
          {formatRupiah(parseFloat(item.product.price))} / item
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => onQty(item.quantity - 1)}
          disabled={disabled || item.quantity <= 1}
          className="
            flex h-7 w-7 items-center justify-center rounded-full
            border border-[#E8ECF4] bg-white text-[#737A87]
            transition-colors hover:border-[#538CDB] hover:text-[#538CDB]
            disabled:cursor-not-allowed disabled:border-[#E8ECF4]
            disabled:bg-[#F5F7FB] disabled:text-[#D8DEE9]
          "
          aria-label="Kurangi jumlah"
        >
          <Icon name="minus" size={12} />
        </button>
        <span className="w-7 text-center text-[13px] font-bold text-[#20242D]">
          {item.quantity}
        </span>
        <button
          type="button"
          onClick={() => onQty(item.quantity + 1)}
          disabled={disabled}
          className="
            flex h-7 w-7 items-center justify-center rounded-full
            border border-[#E8ECF4] bg-white text-[#737A87]
            transition-colors hover:border-[#538CDB] hover:text-[#538CDB]
            disabled:cursor-not-allowed disabled:border-[#E8ECF4]
            disabled:bg-[#F5F7FB] disabled:text-[#D8DEE9]
          "
          aria-label="Tambah jumlah"
        >
          <Icon name="plus" size={12} />
        </button>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-[14px] font-bold text-[#20242D]">
          {formatRupiah(parseFloat(item.subtotal))}
        </p>
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          className="
            mt-0.5 inline-flex items-center gap-1 text-[10px]
            font-semibold text-[#FF4646] transition-colors
            hover:text-[#C73535] disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <Icon name="trash" size={11} />
          Hapus
        </button>
      </div>
    </div>
  );
};

export default PlanItemRow;