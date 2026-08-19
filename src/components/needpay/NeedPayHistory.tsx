import React from 'react';

import Icon from '../ui/Icon';
import { formatRupiah } from '../../utils/currency';
import type { WalletTransaction } from '../../api/wallet';

const TX_LABEL: Record<WalletTransaction['type'], string> = {
  TOPUP: 'Isi Saldo',
  PAYMENT: 'Pembayaran',
  REFUND: 'Pengembalian',
  WITHDRAWAL: 'Penarikan',
};

const TX_ICON: Record<WalletTransaction['type'], any> = {
  TOPUP: 'plus',
  PAYMENT: 'cart',
  REFUND: 'card',
  WITHDRAWAL: 'wallet',
};

const STATUS_LABEL: Record<WalletTransaction['status'], string> = {
  PENDING: 'Menunggu',
  SUCCESS: 'Berhasil',
  FAILED: 'Gagal',
  EXPIRED: 'Kadaluwarsa',
};

const STATUS_STYLE: Record<
  WalletTransaction['status'],
  { bg: string; text: string }
> = {
  PENDING: { bg: 'bg-[#FFF7E0]', text: 'text-[#B45309]' },
  SUCCESS: { bg: 'bg-[#e6f4ee]', text: 'text-[#12805c]' },
  FAILED: { bg: 'bg-[#FFF0F0]', text: 'text-[#ba1a1a]' },
  EXPIRED: { bg: 'bg-[#F5F7FB]', text: 'text-[#737686]' },
};

const TransactionRow: React.FC<{ tx: WalletTransaction }> = ({ tx }) => {
  const isCredit = tx.type === 'TOPUP' || tx.type === 'REFUND';
  const settled = tx.status === 'SUCCESS';
  const statusStyle = STATUS_STYLE[tx.status];

  return (
    <li className="flex items-center gap-3 border-b border-[#F5F7FB] py-3.5 last:border-0">
      <span
        className={`
          flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
          ${
            isCredit && settled
              ? 'bg-[#e6f4ee] text-[#12805c]'
              : !settled
                ? 'bg-[#FFF7E0] text-[#B45309]'
                : 'bg-[#F5F7FB] text-[#737686]'
          }
        `}
      >
        <Icon name={TX_ICON[tx.type]} size={17} />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[13px] font-semibold text-[#101319]">
            {TX_LABEL[tx.type]}
          </span>
          {!settled && (
            <span
              className={`
                rounded-full px-2 py-0.5 text-[9px] font-semibold
                ${statusStyle.bg} ${statusStyle.text}
              `}
            >
              {STATUS_LABEL[tx.status]}
            </span>
          )}
        </div>
        {tx.type === 'WITHDRAWAL' && tx.bankName && (
          <span className="mt-0.5 block truncate font-mono text-[10px] text-[#737686]">
            {tx.bankName} · {tx.bankAccount} a.n. {tx.bankAccountName}
          </span>
        )}
        <span className="mt-0.5 block text-[10px] text-[#A2A8B3]">
          {new Date(tx.createdAt).toLocaleString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>

      <div className="shrink-0 text-right">
        <span
          className={`
            block text-[14px] font-bold
            ${
              !settled
                ? 'text-[#737686]'
                : isCredit
                  ? 'text-[#12805c]'
                  : 'text-[#101319]'
            }
          `}
        >
          {isCredit ? '+' : '−'} {formatRupiah(tx.amount)}
        </span>
        {settled && tx.balanceAfter && (
          <span className="block text-[10px] text-[#A2A8B3]">
            Sisa {formatRupiah(tx.balanceAfter)}
          </span>
        )}
      </div>
    </li>
  );
};

interface NeedPayHistoryProps {
  transactions: WalletTransaction[];
  loading: boolean;
}

const NeedPayHistory: React.FC<NeedPayHistoryProps> = ({
  transactions,
  loading,
}) => {
  return (
    <section
      className="
        mt-6 overflow-hidden rounded-[24px] border border-white/80
        bg-white/95 p-6 shadow-[0_18px_50px_rgba(32,36,45,0.08)]
        backdrop-blur-sm
      "
    >
      <div className="mb-4">
        <p
          className="
            mb-1 text-[10px] font-semibold uppercase tracking-[0.18em]
            text-[#4077a6]
          "
        >
          Aktivitas akun
        </p>
        <h2 className="text-[17px] font-bold text-[#101319]">
          Riwayat Transaksi
        </h2>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl p-3">
              <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-[#F5F7FB]" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-3/4 animate-pulse rounded-full bg-[#F5F7FB]" />
                <div className="h-2.5 w-1/2 animate-pulse rounded-full bg-[#F5F7FB]" />
              </div>
              <div className="h-4 w-20 animate-pulse rounded-full bg-[#F5F7FB]" />
            </div>
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="py-10 text-center">
          <div
            className="
              mx-auto flex h-14 w-14 items-center justify-center
              rounded-full bg-[#F5F7FB]
            "
          >
            <Icon name="wallet" size={22} className="text-[#A2A8B3]" />
          </div>
          <p className="mt-3 text-[13px] font-semibold text-[#101319]">
            Belum ada transaksi
          </p>
          <p className="mt-1 text-[11px] text-[#A2A8B3]">
            Isi saldo untuk memulai perjalanan NeedPay-mu.
          </p>
        </div>
      ) : (
        <ul>
          {transactions.map((tx) => (
            <TransactionRow key={tx.id} tx={tx} />
          ))}
        </ul>
      )}
    </section>
  );
};

export default NeedPayHistory;