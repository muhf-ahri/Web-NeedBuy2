import React from 'react';
import { formatRupiah } from '../../../utils/currency';
import type { AdminPayment, PaymentStatus } from '../../../api/admin';

interface TablePaymentsProps {
  payments: AdminPayment[];
  isLoading?: boolean;
  emptyMessage?: string;
}

const statusColor: Record<PaymentStatus, string> = {
  PAID: 'bg-[#e6f4ee] text-[#12805c]',
  PENDING: 'bg-[#fff7e0] text-[#b45309]',
  FAILED: 'bg-[#fff0f0] text-[#93000a]',
  EXPIRED: 'bg-[#f2f4f6] text-[#737686]',
  REFUNDED: 'bg-[#dbe1ff] text-[#004ac6]',
};

const statusDotColor: Record<PaymentStatus, string> = {
  PAID: 'bg-[#12805c]',
  PENDING: 'bg-[#b45309]',
  FAILED: 'bg-[#93000a]',
  EXPIRED: 'bg-[#737686]',
  REFUNDED: 'bg-[#004ac6]',
};

const statusLabel: Record<PaymentStatus, string> = {
  PAID: 'Berhasil',
  PENDING: 'Menunggu',
  FAILED: 'Gagal',
  EXPIRED: 'Kedaluwarsa',
  REFUNDED: 'Dikembalikan',
};

const methodLabel: Record<string, string> = {
  MIDTRANS: 'Midtrans',
  COD: 'Bayar di Tempat',
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

const TablePayments: React.FC<TablePaymentsProps> = ({
  payments,
  isLoading = false,
  emptyMessage = 'Tidak ada transaksi.',
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

  if (payments.length === 0) {
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
      {payments.map((payment) => (
        <tr key={payment.id} className="text-[13px] transition-colors hover:bg-[#f5f7fb]">
          <td className="py-2.5 pr-2 font-medium text-[#004ac6]">{payment.midtransOrderId}</td>
          <td className="py-2.5 pr-2 font-medium text-[#101319]">{payment.order.orderNumber}</td>
          <td className="py-2.5 pr-2">
            <div className="text-[#434655]">{payment.order.user.name}</div>
            <div className="text-[11px] text-[#737686]">{payment.order.user.email}</div>
          </td>
          <td className="py-2.5 pr-2 font-semibold text-[#004ac6]">
            {formatRupiah(Number(payment.order.total))}
          </td>
          <td className="py-2.5 pr-2 text-[#434655]">
            {payment.method ? methodLabel[payment.method] ?? payment.method : 'Belum ada'}
          </td>
          <td className="py-2.5 pr-2">
            <span className="flex items-center gap-1.5">
              <span
                className={`inline-block h-2 w-2 rounded-full ${statusDotColor[payment.status]}`}
              />
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusColor[payment.status]}`}
              >
                {statusLabel[payment.status]}
              </span>
            </span>
          </td>
          <td className="py-2.5 text-[#737686]">
            {payment.paidAt ? formatDate(payment.paidAt) : formatDate(payment.createdAt)}
          </td>
        </tr>
      ))}
    </>
  );
};

export default TablePayments;
