// src/pages/admin/components/VoucherTable.tsx
import React from 'react';
import Icon from '../../../components/ui/Icon';
import { type Voucher } from '../data/promotionsData';

interface TableVoucherProps {
  vouchers: Voucher[];
  isLoading?: boolean;
  emptyMessage?: string;
}

const statusColor: Record<Voucher['status'], string> = {
  active: 'bg-[#d7f5dc] text-[#156b32]',
  paused: 'bg-[#fff4e0] text-[#b45309]',
  expired: 'bg-[#f2f4f6] text-[#737686]',
};

const statusLabel: Record<Voucher['status'], string> = {
  active: 'Aktif',
  paused: 'Ditahan',
  expired: 'Kadaluwarsa',
};

const discountTypeLabel: Record<Voucher['discountType'], string> = {
  percentage: 'Persentase',
  fixed: 'Nominal',
};

const formatDate = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

const TableVoucher: React.FC<TableVoucherProps> = ({
  vouchers,
  isLoading = false,
  emptyMessage = 'Tidak ada voucher.',
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

  if (vouchers.length === 0) {
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
      {vouchers.map((voucher) => (
        <tr key={voucher.id} className="text-[13px] transition-colors hover:bg-[#f8f9fb]">
          <td className="py-2.5 pr-2">
            <div className="font-medium text-[#004ac6]">{voucher.code}</div>
            <div className="text-[11px] text-[#737686]">{voucher.title}</div>
          </td>
          <td className="py-2.5 pr-2 text-[#434655]">{discountTypeLabel[voucher.discountType]}</td>
          <td className="py-2.5 pr-2 font-semibold text-[#191c1e]">
            {voucher.discountType === 'percentage' ? `${voucher.value}%` : `$${voucher.value.toFixed(2)}`}
          </td>
          <td className="py-2.5 pr-2 text-[#434655]">
            {voucher.used.toLocaleString('id-ID')} / {voucher.quota === null ? '∞' : voucher.quota.toLocaleString('id-ID')}
          </td>
          <td className="py-2.5 pr-2 text-[#737686] text-[12px]">
            {formatDate(voucher.validFrom)} - {formatDate(voucher.validTo)}
          </td>
          <td className="py-2.5 pr-2">
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusColor[voucher.status]}`}>
              {statusLabel[voucher.status]}
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

export default TableVoucher;