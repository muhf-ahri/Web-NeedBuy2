// src/pages/admin/components/PaymentTable.tsx
import React from 'react';
import Icon from '../../../components/ui/Icon';
import { formatRupiah } from '../../../utils/currency';
import type { Payment } from '../data/paymentsData';

interface TablePaymentsProps {
  payments: Payment[];
  isLoading?: boolean;
  emptyMessage?: string;
}

const statusColor: Record<Payment['status'], string> = {
  Paid: 'bg-[#d7f5dc] text-[#156b32]',
  Pending: 'bg-[#fff4e0] text-[#b45309]',
  Failed: 'bg-[#ffe0e0] text-[#a33131]',
  Refunded: 'bg-[#f2f4f6] text-[#737686]',
};

const statusDotColor: Record<Payment['status'], string> = {
  Paid: 'bg-[#156b32]',
  Pending: 'bg-[#b45309]',
  Failed: 'bg-[#a33131]',
  Refunded: 'bg-[#737686]',
};

const statusLabel: Record<Payment['status'], string> = {
  Paid: 'Berhasil',
  Pending: 'Menunggu',
  Failed: 'Gagal',
  Refunded: 'Dikembalikan',
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const TablePayments: React.FC<TablePaymentsProps> = ({
  payments,
  isLoading = false,
  emptyMessage = 'Tidak ada transaksi.',
}) => {
  if (isLoading) {
    return (
      <tr>
        <td colSpan={8} className="py-10 text-center text-[#737686]">
          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-[#004ac6] border-t-transparent" />
          <span className="ml-2">Memuat…</span>
        </td>
      </tr>
    );
  }

  if (payments.length === 0) {
    return (
      <tr>
        <td colSpan={8} className="py-10 text-center text-[#737686]">
          {emptyMessage}
        </td>
      </tr>
    );
  }

  return (
    <>
      {payments.map((payment) => (
        <tr key={payment.id} className="text-[13px] transition-colors hover:bg-[#f8f9fb]">
          <td className="py-2.5 pr-2 font-medium text-[#004ac6]">
            {payment.transactionId}
          </td>
          <td className="py-2.5 pr-2 font-medium text-[#191c1e]">
            {payment.orderId}
          </td>
          <td className="py-2.5 pr-2 text-[#434655]">{payment.buyerName}</td>
          <td className="py-2.5 pr-2 font-semibold text-[#004ac6]">
            {formatRupiah(payment.amount)}
          </td>
          <td className="py-2.5 pr-2 text-[#434655]">
            {payment.method}
            {payment.methodDetails && (
              <span className="ml-1 text-[11px] text-[#737686]">
                {payment.methodDetails}
              </span>
            )}
          </td>
          <td className="py-2.5 pr-2">
            <span className="flex items-center gap-1.5">
              <span className={`inline-block h-2 w-2 rounded-full ${statusDotColor[payment.status]}`} />
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusColor[payment.status]}`}
              >
                {statusLabel[payment.status]}
              </span>
            </span>
          </td>
          <td className="py-2.5 pr-2 text-[#737686]">
            {formatDate(payment.date)}
          </td>
          <td className="py-2.5 text-center">
            <button
              className="rounded-lg p-1.5 text-[#737686] transition-colors hover:bg-[#f2f4f6] hover:text-[#004ac6]"
              aria-label="Detail transaksi"
            >
              <Icon name="eye" size={16} />
            </button>
          </td>
        </tr>
      ))}
    </>
  );
};

export default TablePayments;