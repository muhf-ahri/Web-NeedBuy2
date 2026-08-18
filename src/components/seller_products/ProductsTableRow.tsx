import React from 'react';
import { Link } from 'react-router-dom';

import Icon from '../ui/Icon';
import { formatRupiah } from '../../utils/currency';
import type { InventProduct, ProductStatus } from '../../api/invent';

interface ProductsTableRowProps {
  product: InventProduct;
  status: ProductStatus;
  onEdit: () => void;
  onDelete: () => void;
}

const STATUS_CLASS: Record<ProductStatus, string> = {
  Tayang: 'bg-[#DCFCE7] text-[#166534]',
  'Stok Habis': 'bg-[#FFF0F0] text-[#C73535]',
  Draf: 'bg-[#F5F7FB] text-[#737A87]',
};

const ProductsTableRow: React.FC<ProductsTableRowProps> = ({
  product,
  status,
  onEdit,
  onDelete,
}) => {
  const image =
    product.images?.find((img) => img.isPrimary)?.url || product.images?.[0]?.url;

  return (
    <tr className="group border-b border-[#F5F7FB] transition-colors last:border-0 hover:bg-[#F5F5FF]/60">

      <td className="px-4 py-3 text-center">
        <div className="flex justify-center">
          <div
            className="
              flex h-12 w-12 items-center justify-center overflow-hidden
              rounded-xl bg-[#F5F7FB] ring-1 ring-[#E8ECF4]
            "
          >
            {image ? (
              <img
                src={image}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <Icon name="product" size={18} className="text-[#A2A8B3]" />
            )}
          </div>
        </div>
      </td>

      <td className="px-4 py-3 text-center">
        <p className="truncate text-[13px] font-semibold text-[#20242D]">
          {product.name}
        </p>
      </td>

      <td className="px-4 py-3 text-center text-[12px] text-[#737A87]">
        {product.category?.name ?? 'Tanpa kategori'}
      </td>

      <td className="px-4 py-3 text-center text-[13px] font-bold text-[#538CDB] tabular-nums">
        {formatRupiah(Number(product.price))}
      </td>

      <td className="px-4 py-3 text-center">
        <span
          className={`
            inline-flex items-center gap-1 rounded-full px-2 py-0.5
            text-[11px] font-semibold tabular-nums
            ${
              product.stock === 0
                ? 'bg-[#FFF0F0] text-[#C73535]'
                : product.stock < 10
                  ? 'bg-[#FFF7E0] text-[#B45309]'
                  : 'bg-[#F5F7FB] text-[#20242D]'
            }
          `}
        >
          <span
            className={`
              h-1 w-1 rounded-full
              ${
                product.stock === 0
                  ? 'bg-[#FF4646]'
                  : product.stock < 10
                    ? 'bg-[#FFD500]'
                    : 'bg-[#22C55E]'
              }
            `}
          />
          {product.stock}
        </span>
      </td>

      <td className="px-4 py-3 text-center">
        <span
          className={`
            inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px]
            font-semibold ${STATUS_CLASS[status]}
          `}
        >
          {status}
        </span>
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="
              flex h-8 w-8 items-center justify-center rounded-lg
              text-[#737A87] transition-all duration-200
              hover:bg-[#EEF5FF] hover:text-[#538CDB]
            "
            aria-label={`Edit ${product.name}`}
            title="Edit"
          >
            <Icon name="edit" size={15} />
          </button>

          <Link
            to={`/products/${product.slug}`}
            className="
              flex h-8 w-8 items-center justify-center rounded-lg
              text-[#737A87] transition-all duration-200
              hover:bg-[#EEF5FF] hover:text-[#538CDB]
            "
            aria-label={`Lihat ${product.name} di toko`}
            title="Lihat di toko"
          >
            <Icon name="eye" size={15} />
          </Link>

          <button
            type="button"
            onClick={onDelete}
            className="
              flex h-8 w-8 items-center justify-center rounded-lg
              text-[#737A87] transition-all duration-200
              hover:bg-[#FFF0F0] hover:text-[#FF4646]
            "
            aria-label={`Hapus ${product.name}`}
            title="Hapus"
          >
            <Icon name="trash" size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductsTableRow;