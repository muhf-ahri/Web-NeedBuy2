// src/pages/admin/components/FlashSaleTable.tsx
import React from 'react';
import Icon from '../../../components/ui/Icon';
import { formatRupiah } from '../../../utils/currency';
import { type FlashSaleProduct } from '../data/promotionsData';

interface TableFlashSaleProps {
  products: FlashSaleProduct[];
  isLoading?: boolean;
  emptyMessage?: string;
}

const statusColor: Record<FlashSaleProduct['status'], string> = {
  ongoing: 'bg-[#d7f5dc] text-[#156b32]',
  upcoming: 'bg-[#cfe8ff] text-[#0057b8]',
  ended: 'bg-[#f2f4f6] text-[#737686]',
};

const statusLabel: Record<FlashSaleProduct['status'], string> = {
  ongoing: 'Berlangsung',
  upcoming: 'Akan Datang',
  ended: 'Selesai',
};

const TableFlashSale: React.FC<TableFlashSaleProps> = ({
  products,
  isLoading = false,
  emptyMessage = 'Tidak ada produk flash sale.',
}) => {
  if (isLoading) {
    return (
      <tr>
        <td colSpan={7} className="py-10 text-center text-[#737686]">
          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-[#004ac6] border-t-transparent" />
          <span className="ml-2">Memuat…</span>
        </td>
      </tr>
    );
  }

  if (products.length === 0) {
    return (
      <tr>
        <td colSpan={7} className="py-10 text-center text-[#737686]">
          {emptyMessage}
        </td>
      </tr>
    );
  }

  return (
    <>
      {products.map((product) => (
        <tr key={product.id} className="text-[13px] transition-colors hover:bg-[#f8f9fb]">
          <td className="py-2.5 pr-2">
            <div className="font-medium text-[#191c1e]">{product.productName}</div>
            <div className="text-[11px] text-[#737686]">{product.category}</div>
          </td>
          <td className="py-2.5 pr-2 text-[#434655]">{product.seller}</td>
          <td className="py-2.5 pr-2 font-semibold text-[#ba1a1a]">-{product.discountPercent}%</td>
          <td className="py-2.5 pr-2 text-[#737686] line-through">
            {formatRupiah(product.originalPrice)}
          </td>
          <td className="py-2.5 pr-2 font-bold text-[#004ac6]">
            {formatRupiah(product.salePrice)}
          </td>
          <td className="py-2.5 pr-2 text-[12px] text-[#737686]">
            <div>{product.startDate}</div>
            <div className="text-[11px]">- {product.endDate}</div>
          </td>
          <td className="py-2.5 pr-2">
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusColor[product.status]}`}>
              {statusLabel[product.status]}
            </span>
          </td>
          <td className="py-2.5">
            <div className="flex items-center gap-1">
              <button className="rounded-lg p-1.5 text-[#737686] transition-colors hover:bg-[#f2f4f6] hover:text-[#004ac6]">
                <Icon name="edit" size={16} />
              </button>
              <button className="rounded-lg p-1.5 text-[#737686] transition-colors hover:bg-[#ffe0e0] hover:text-[#ba1a1a]">
                <Icon name="trash" size={16} />
              </button>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

export default TableFlashSale;