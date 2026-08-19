import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../ui/Icon';
import {
  DiscountChip,
  strikePrice,
} from '../ui/DiscountBadge';
import { formatRupiah } from '../../utils/currency';
import type { Product } from '../../types';

const PriceRow: React.FC<{ product: Product }> = ({
  product,
}) => {
  const onSale = product.discountPercent > 0;

  const strike = onSale
    ? strikePrice(
        product.price,
        product.discountPercent
      )
    : 0;

  return (
    <li>
      <Link
        to={`/products/${product.slug}`}
        className="
          group flex items-center gap-3
          rounded-xl
          px-3 py-3
          transition-all duration-200
          hover:bg-[#f5f7fb]
          focus-visible:outline-2
          focus-visible:outline-offset-2
          focus-visible:outline-[#4077a6]
        "
      >
        <span className="min-w-0 shrink">
          <span className="flex items-center gap-1.5">
            <span
              className="
                truncate
                text-[13px]
                font-semibold
                text-[#101319]
                group-hover:text-[#4077a6]
              "
            >
              {product.name}
            </span>

            <DiscountChip
              discountPercent={product.discountPercent}
            />
          </span>

          <span className="mt-0.5 block text-[11px] text-[#737686]">
            {product.category?.name}
            {product.stock === 0 && ' · stok habis'}
          </span>
        </span>

        <span
          className="
            hidden flex-1
            border-b border-dashed
            border-[#e0e3e5]
            sm:block
          "
          aria-hidden="true"
        />

        <span className="shrink-0 text-right">
          <span className="block text-[13px] font-bold text-[#101319]">
            {formatRupiah(product.price)}
          </span>

          {onSale && (
            <span className="text-[10px] text-[#737686] line-through">
              {formatRupiah(strike)}
            </span>
          )}
        </span>

        <span
          className="
            hidden text-[#4077a6]
            opacity-0
            transition-opacity
            group-hover:opacity-100
            sm:block
          "
        >
          <Icon name="arrowRight" size={14} />
        </span>
      </Link>
    </li>
  );
};

export default PriceRow;