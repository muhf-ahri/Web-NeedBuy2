import React from 'react';
import Icon from './Icon';
import { formatRupiah } from '../../utils/currency';

interface BalanceCardProps {
  balance: number | string;
  walletId?: string;
  loading?: boolean;
}

const BalanceCard: React.FC<BalanceCardProps> = ({
  balance,
  walletId,
  loading = false,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#004ac6] to-[#002a7a] p-6 text-white shadow-lg">
      
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/5" />
      <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-white/5" />
      <div className="absolute right-8 top-8 opacity-10">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z" />
        </svg>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-white/20 p-1.5">
              <Icon name="wallet" size={18} className="text-white" />
            </div>
            <span className="text-sm font-semibold tracking-wide text-white/80">
              NeedPay
            </span>
          </div>
          {walletId && (
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-mono font-medium text-white/60">
              #{walletId.slice(0, 8)}
            </span>
          )}
        </div>

        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wider text-white/60">
            Total Saldo
          </p>
          {loading ? (
            <div className="mt-1 h-10 w-40 animate-pulse rounded bg-white/10" />
          ) : (
            <p className="mt-1 text-4xl font-bold tracking-tight">
              {formatRupiah(balance)}
            </p>
          )}
        </div>

        <div className="mt-4 flex items-center gap-4 border-t border-white/10 pt-4">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-white/60">Status:</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-green-400/20 px-2 py-0.5 text-xs font-semibold text-green-300">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
              Aktif
            </span>
          </div>
          <button
            onClick={() => navigator.clipboard?.writeText(walletId || '')}
            className="text-xs text-white/50 hover:text-white/80 transition-colors"
          >
            Salin ID
          </button>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;