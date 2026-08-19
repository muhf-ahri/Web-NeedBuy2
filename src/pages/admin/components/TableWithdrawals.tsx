import React from 'react';
import Icon from '../../../components/ui/Icon';
import { formatRupiah } from '../../../utils/currency';
import type { AdminWithdrawal, WithdrawalStatus } from '../../../api/admin';

interface TableWithdrawalsProps {
  withdrawals: AdminWithdrawal[];
  isLoading?: boolean;
  emptyMessage?: string;
  onAction: (id: string, action: 'APPROVE' | 'REJECT') => void;
  pendingId?: string | null;
}

export const statusLabel: Record<WithdrawalStatus, string> = {
  PENDING: 'Menunggu',
  SUCCESS: 'Ditransfer',
  FAILED: 'Ditolak',
};

export const statusColor: Record<WithdrawalStatus, string> = {
  PENDING: 'bg-[#fff7e0] text-[#b45309]',
  SUCCESS: 'bg-[#e6f4ee] text-[#12805c]',
  FAILED: 'bg-[#fff0f0] text-[#93000a]',
};

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
  pendingId = null,
}) => {
  if (isLoading) {
    return (
      <tr>
        <td colSpan={7} className="py-10 text-center text-[#737686]">
          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-[#538cbd] border-t-transparent" />
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
      {withdrawals.map((withdrawal) => {
        const user = withdrawal.wallet.user;
        const busy = pendingId === withdrawal.id;
        return (
          <tr key={withdrawal.id} className="text-[13px] transition-colors hover:bg-[#f5f7fb]">
            
            <td className="py-2.5 pr-2 font-medium text-[#4077a6]">
              #{withdrawal.id.slice(0, 8).toUpperCase()}
            </td>
            <td className="py-2.5 pr-2">
              <div className="font-medium text-[#101319]">
                {user.seller?.storeName ?? user.name}
              </div>
              <div className="text-[11px] text-[#737686]">{user.email}</div>
            </td>
            <td className="py-2.5 pr-2 font-semibold text-[#4077a6]">
              {formatRupiah(withdrawal.amount)}
            </td>
            <td className="py-2.5 pr-2">
              <div className="text-[#101319]">{withdrawal.bankName ?? 'Belum diisi'}</div>
              <div className="text-[11px] text-[#737686]">
                {withdrawal.bankAccount ?? 'Belum diisi'}
                {withdrawal.bankAccountName ? ` · a.n. ${withdrawal.bankAccountName}` : ''}
              </div>
            </td>
            <td className="py-2.5 pr-2 text-[#737686]">{formatDate(withdrawal.createdAt)}</td>
            <td className="py-2.5 pr-2">
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusColor[withdrawal.status]}`}
              >
                {statusLabel[withdrawal.status]}
              </span>
            </td>
            <td className="py-2.5">
              {withdrawal.status === 'PENDING' ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onAction(withdrawal.id, 'APPROVE')}
                    disabled={busy}
                    className="rounded-lg p-1.5 text-[#12805c] transition-colors hover:bg-[#e6f4ee] disabled:opacity-40"
                    aria-label="Setujui"
                    title="Setujui: dana sudah ditransfer"
                  >
                    <Icon name="check" size={16} />
                  </button>
                  <button
                    onClick={() => onAction(withdrawal.id, 'REJECT')}
                    disabled={busy}
                    className="rounded-lg p-1.5 text-[#ba1a1a] transition-colors hover:bg-[#fff0f0] disabled:opacity-40"
                    aria-label="Tolak"
                    title="Tolak: saldo dikembalikan ke penjual"
                  >
                    <Icon name="close" size={16} />
                  </button>
                </div>
              ) : (
                <span className="text-[11px] text-[#737686]">{withdrawal.note ?? 'Tanpa catatan'}</span>
              )}
            </td>
          </tr>
        );
      })}
    </>
  );
};

export default TableWithdrawals;
