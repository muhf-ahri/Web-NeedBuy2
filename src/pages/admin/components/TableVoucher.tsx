import React from 'react';
import { formatRupiah } from '../../../utils/currency';
import type { AdminCoupon } from '../../../api/admin';

interface TableVoucherProps {
  vouchers: AdminCoupon[];
  isLoading?: boolean;
  emptyMessage?: string;
  onToggleActive: (coupon: AdminCoupon) => void;
  pendingId?: string | null;
}

type VoucherStatus = 'active' | 'paused' | 'expired';

const deriveStatus = (coupon: AdminCoupon): VoucherStatus => {
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return 'expired';
  return coupon.isActive ? 'active' : 'paused';
};

const statusColor: Record<VoucherStatus, string> = {
  active: 'bg-[#e6f4ee] text-[#12805c]',
  paused: 'bg-[#fff7e0] text-[#b45309]',
  expired: 'bg-[#f2f4f6] text-[#737686]',
};

const statusLabel: Record<VoucherStatus, string> = {
  active: 'Aktif',
  paused: 'Ditahan',
  expired: 'Kadaluwarsa',
};

const typeLabel: Record<AdminCoupon['type'], string> = {
  PERCENT: 'Persentase',
  FIXED: 'Nominal',
  FREE_SHIPPING: 'Gratis Ongkir',
};

const formatDate = (date: string | null) => {
  if (!date) return ': ';
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatValue = (coupon: AdminCoupon) => {
  if (coupon.type === 'PERCENT') return `${Number(coupon.value)}%`;
  if (coupon.type === 'FREE_SHIPPING') return 'Ongkir';
  return formatRupiah(coupon.value);
};

const TableVoucher: React.FC<TableVoucherProps> = ({
  vouchers,
  isLoading = false,
  emptyMessage = 'Tidak ada voucher.',
  onToggleActive,
  pendingId = null,
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
      {vouchers.map((voucher) => {
        const status = deriveStatus(voucher);
        return (
          <tr key={voucher.id} className="text-[13px] transition-colors hover:bg-[#f5f7fb]">
            <td className="py-2.5 pr-2">
              <div className="font-medium text-[#004ac6]">{voucher.code}</div>
              <div className="text-[11px] text-[#737686]">{voucher.title}</div>
            </td>
            <td className="py-2.5 pr-2 text-[#434655]">{typeLabel[voucher.type]}</td>
            <td className="py-2.5 pr-2 font-semibold text-[#101319]">{formatValue(voucher)}</td>
            <td className="py-2.5 pr-2 text-[#434655]">
              {voucher.usedCount.toLocaleString('id-ID')} /{' '}
              {voucher.quota === null ? '∞' : voucher.quota.toLocaleString('id-ID')}
            </td>
            <td className="py-2.5 pr-2 text-[12px] text-[#737686]">
              {formatDate(voucher.startsAt)} - {formatDate(voucher.expiresAt)}
            </td>
            <td className="py-2.5 pr-2">
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusColor[status]}`}
              >
                {statusLabel[status]}
              </span>
            </td>
            <td className="py-2.5">
              <button
                onClick={() => onToggleActive(voucher)}
                disabled={pendingId === voucher.id || status === 'expired'}
                className={`rounded-full px-3 py-1 text-[12px] font-semibold text-white transition-colors disabled:opacity-50 ${
                  voucher.isActive
                    ? 'bg-[#ba1a1a] hover:bg-[#93000a]'
                    : 'bg-[#004ac6] hover:bg-[#003ea8]'
                }`}
              >
                {voucher.isActive ? 'Tahan' : 'Aktifkan'}
              </button>
            </td>
          </tr>
        );
      })}
    </>
  );
};

export default TableVoucher;
