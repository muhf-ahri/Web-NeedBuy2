// src/pages/admin/components/WithdrawalTable.tsx
import React from 'react';
import Icon from '../../../components/ui/Icon';
import { formatRupiah } from '../../../utils/currency';
import { type Withdrawal, statusLabel, statusColor } from '../data/withdrawalsData';

interface TableWithdrawalsProps {
  withdrawals: Withdrawal[];
  isLoading?: boolean;
  emptyMessage?: string;
  onAction?: (id: string, action: 'approve' | 'reject') => void;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const TableWithdrawals: React.FC<TableWithdrawalsProps> = ({
  withdrawals,
  isLoading = false,
  emptyMessage = 'Tidak ada permintaan penarikan.',
  onAction,
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

  if (withdrawals.length === 0) {
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
      {withdrawals.map((withdrawal) => (
        <tr key={withdrawal.id} className="text-[13px] transition-colors hover:bg-[#f8f9fb]">
          <td className="py-2.5 pr-2 font-medium text-[#004ac6]">
            {withdrawal.withdrawalId}
          </td>
          <td className="py-2.5 pr-2">
            <div className="font-medium text-[#191c1e]">{withdrawal.seller}</div>
            <div className="text-[11px] text-[#737686]">ID: {withdrawal.sellerId}</div>
          </td>
          <td className="py-2.5 pr-2 font-semibold text-[#004ac6]">
            {formatRupiah(withdrawal.amount)}
          </td>
          <td className="py-2.5 pr-2">
            <div className="text-[#191c1e]">{withdrawal.bankName}</div>
            <div className="text-[11px] text-[#737686]">
              {withdrawal.bankAccount} · Routing: {withdrawal.routingNumber}
            </div>
          </td>
          <td className="py-2.5 pr-2 text-[#737686]">
            {formatDate(withdrawal.requestedDate)}
          </td>
          <td className="py-2.5 pr-2">
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusColor[withdrawal.status]}`}
            >
              {statusLabel[withdrawal.status]}
            </span>
          </td>
          <td className="py-2.5">
            <div className="flex items-center gap-1">
              {withdrawal.status === 'pending' && onAction && (
                <>
                  <button
                    onClick={() => onAction(withdrawal.id, 'approve')}
                    className="rounded-lg p-1.5 text-[#156b32] transition-colors hover:bg-[#d7f5dc]"
                    aria-label="Setujui"
                    title="Setujui"
                  >
                    <Icon name="check" size={16} />
                  </button>
                  <button
                    onClick={() => onAction(withdrawal.id, 'reject')}
                    className="rounded-lg p-1.5 text-[#ba1a1a] transition-colors hover:bg-[#ffe0e0]"
                    aria-label="Tolak"
                    title="Tolak"
                  >
                    <Icon name="close" size={16} />
                  </button>
                </>
              )}
              {withdrawal.status !== 'pending' && (
                <span className="text-[11px] text-[#737686]">
                  {withdrawal.status === 'approved' && 'Disetujui'}
                  {withdrawal.status === 'processed' && 'Diproses'}
                  {withdrawal.status === 'rejected' && 'Ditolak'}
                </span>
              )}
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

export default TableWithdrawals;