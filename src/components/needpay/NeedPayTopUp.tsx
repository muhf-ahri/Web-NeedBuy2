import React from 'react';

import Icon from '../ui/Icon';
import { formatRupiah } from '../../utils/currency';

interface NeedPayTopupProps {
  amount: string;
  onAmountChange: (value: string) => void;
  onSubmit: () => void;
  busy: boolean;
  quickAmounts: number[];
  minTopup: number;
}

const NeedPayTopup: React.FC<NeedPayTopupProps> = ({
  amount,
  onAmountChange,
  onSubmit,
  busy,
  quickAmounts,
  minTopup,
}) => {
  return (
    <section
      className="
        mt-6 overflow-hidden rounded-[24px] border border-white/80
        bg-white/95 p-6 shadow-[0_18px_50px_rgba(32,36,45,0.08)]
        backdrop-blur-sm
      "
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p
            className="
              mb-1 text-[10px] font-semibold uppercase tracking-[0.18em]
              text-[#004ac6]
            "
          >
            Tambah saldo
          </p>
          <h2 className="text-[17px] font-bold text-[#101319]">Isi Saldo</h2>
        </div>

        <span
          className="
            hidden items-center gap-1.5 text-[10px] font-medium
            text-[#A2A8B3] sm:flex
          "
        >
          <Icon name="lock" size={11} />
          Pembayaran aman via Midtrans
        </span>
      </div>

      <div className="mt-5">
        <p
          className="
            mb-2 text-[10px] font-semibold uppercase tracking-[0.16em]
            text-[#737686]
          "
        >
          Nominal cepat
        </p>
        <div className="flex flex-wrap gap-2">
          {quickAmounts.map((value) => {
            const picked = Number(amount) === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => onAmountChange(String(value))}
                className={`
                  rounded-full px-4 py-2 text-[12px] font-semibold
                  transition-all duration-200
                  ${
                    picked
                      ? 'bg-[#004ac6] text-white shadow-[0_6px_16px_rgba(83,140,219,0.25)]'
                      : 'bg-[#F5F7FB] text-[#101319] hover:bg-[#f5f7fb] hover:text-[#004ac6]'
                  }
                `}
              >
                {formatRupiah(value)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <span
            className="
              absolute left-4 top-1/2 -translate-y-1/2 text-[13px]
              font-semibold text-[#737686]
            "
          >
            Rp
          </span>
          <input
            type="number"
            inputMode="numeric"
            min={minTopup}
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder={`Min ${formatRupiah(minTopup)}`}
            className="
              w-full rounded-full border border-[#e0e3e5] bg-[#F5F7FB]
              py-3 pl-10 pr-4 text-[13px] text-[#101319] outline-none
              transition-all duration-200 focus:border-[#004ac6]
              focus:bg-white focus:shadow-[0_6px_20px_rgba(83,140,219,0.12)]
            "
          />
        </div>

        <button
          type="button"
          onClick={onSubmit}
          disabled={busy || !amount}
          className="
            flex h-11 items-center justify-center gap-2 rounded-full
            bg-[#004ac6] px-6 text-[13px] font-semibold text-white
            shadow-[0_7px_18px_rgba(83,140,219,0.25)] transition-all
            duration-200 hover:bg-[#004ac6]
            hover:shadow-[0_9px_22px_rgba(83,140,219,0.30)]
            active:scale-[0.99] disabled:cursor-not-allowed
            disabled:bg-[#A2A8B3] disabled:shadow-none sm:w-auto
          "
        >
          {busy && <Icon name="clock" size={15} className="animate-spin" />}
          {busy ? 'Memproses...' : 'Isi Saldo'}
        </button>
      </div>

      <p
        className="
          mt-3 flex items-center gap-1.5 text-[11px] text-[#A2A8B3]
          sm:hidden
        "
      >
        <Icon name="lock" size={11} />
        Pembayaran aman melalui Midtrans
      </p>
    </section>
  );
};

export default NeedPayTopup;