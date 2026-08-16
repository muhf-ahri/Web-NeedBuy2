import React from 'react';

import Icon from '../ui/Icon';
import { formatRupiah } from '../../utils/currency';
import { PAYMENT_METHODS } from '../ui/NeedPayNote';
import needpayCard from '../../../public/CardBalance.jpg';

const serialFrom = (walletId: string | undefined): string =>
  walletId
    ? `NP ${walletId.replace(/-/g, '').slice(0, 10).toUpperCase()}`
    : 'NP ··········';

interface NeedPayBalanceCardProps {
  balance: string | number;
  walletId?: string;
  loading?: boolean;
  onTopUp?: () => void;
}

const NeedPayBalanceCard: React.FC<NeedPayBalanceCardProps> = ({
  balance,
  walletId,
  loading = false,
  onTopUp,
}) => {
  const formatted = formatRupiah(balance);

  return (
    <figure
      className="
        w-full overflow-hidden rounded-[24px] border border-white/80
        bg-white/95 shadow-[0_18px_50px_rgba(32,36,45,0.10)]
        backdrop-blur-sm
      "
    >
      {/* Mobile: gambar di atas */}
      <div className="relative h-44 md:hidden">
        <img
          src={needpayCard}
          alt="NeedPay"
          draggable={false}
          className="absolute inset-0 h-full w-full select-none object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#20242D]/55 via-transparent to-transparent" />
        <div
          className="
            absolute left-4 top-4 inline-flex items-center gap-1.5
            rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold
            uppercase tracking-[0.18em] text-[#538CDB] backdrop-blur-sm
          "
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
          NeedPay
        </div>
        <div className="absolute bottom-3 left-4 flex items-center gap-2 text-[10px] text-white/90">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
          <span className="truncate font-mono">{serialFrom(walletId)}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-[0.9fr_1.1fr]">
        {/* Panel kiri: gambar besar */}
        <section className="relative hidden min-h-[420px] overflow-hidden md:block">
          <img
            src={needpayCard}
            alt="NeedPay"
            draggable={false}
            className="
              absolute inset-0 h-full w-full select-none object-cover
              transition-transform duration-700 hover:scale-[1.03]
            "
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#20242D]/55 via-transparent to-transparent" />

          <svg
            className="pointer-events-none absolute inset-y-0 right-0 h-full w-16 md:w-20"
            viewBox="0 0 100 400"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M100 0 C 40 40, 90 90, 55 140 C 20 190, 70 230, 90 280 C 105 320, 50 360, 100 400 L 130 400 L 130 0 Z"
              fill="white"
            />
          </svg>

          <div
            className="
              absolute left-6 top-6 z-10 inline-flex items-center gap-1.5
              rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold
              uppercase tracking-[0.18em] text-[#538CDB] backdrop-blur-sm
            "
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
            NeedPay
          </div>

          <div className="absolute bottom-5 left-6 z-10 flex items-center gap-2 text-[10px] text-white/90">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
            <span className="truncate font-mono">{serialFrom(walletId)}</span>
          </div>
        </section>

        {/* Panel kanan: saldo + grid payment */}
        <section className="flex items-center bg-white px-6 py-7 sm:px-8 lg:px-10">
          <div className="mx-auto w-full max-w-lg">
            <div className="mb-4 md:hidden">
              <p className="text-xs font-semibold text-[#538CDB]">NeedPay</p>
            </div>

            <p
              className="
                mb-2 text-[10px] font-semibold uppercase tracking-[0.18em]
                text-[#538CDB]
              "
            >
              Saldo NeedPay
            </p>

            <h3
              className="
                text-[22px] font-bold leading-tight tracking-tight
                text-[#20242D] sm:text-[26px]
              "
            >
              Saldo kamu, siap dipakai.
            </h3>

            {/* Kotak saldo compact */}
            <div
              className="
                mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl
                bg-[#F5F7FB] px-5 py-3.5
              "
            >
              {loading ? (
                <div className="h-8 w-32 animate-pulse rounded-lg bg-[#538CDB]/15" />
              ) : (
                <p
                  className="
                    truncate text-[26px] font-extrabold tracking-tight
                    text-[#20242D] sm:text-[28px]
                  "
                  title={formatted}
                >
                  {formatted}
                </p>
              )}

              <span
                className="
                  inline-flex shrink-0 items-center gap-1.5 rounded-full
                  bg-white px-2.5 py-1 text-[10px] font-semibold
                  text-[#20242D] ring-1 ring-[#E8ECF4]
                "
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
                Aktif
              </span>

              <p className="truncate font-mono text-[10px] text-[#A2A8B3]">
                {serialFrom(walletId)}
              </p>
            </div>

            {/* Grid metode pembayaran */}
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <p
                  className="
                    text-[10px] font-semibold uppercase tracking-[0.18em]
                    text-[#737A87]
                  "
                >
                  Isi saldo lewat
                </p>
                <span className="text-[10px] font-medium text-[#A2A8B3]">
                  Gratis biaya admin
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {PAYMENT_METHODS.map((method) => (
                  <div
                    key={method.label}
                    className="
                      flex flex-col items-center gap-1.5 rounded-xl border
                      border-[#E8ECF4] bg-white px-1.5 py-2.5 shadow-sm
                      transition-all duration-200 hover:-translate-y-0.5
                      hover:border-[#538CDB]/40
                      hover:shadow-[0_6px_16px_rgba(83,140,219,0.12)]
                    "
                  >
                    <span
                      className="
                        flex h-8 w-10 items-center justify-center
                        overflow-hidden rounded-lg bg-white ring-1
                        ring-[#E8ECF4]
                      "
                    >
                      <img
                        src={method.logo}
                        alt={method.label}
                        loading="lazy"
                        draggable={false}
                        className="h-full w-full select-none object-contain p-1"
                      />
                    </span>
                    <span className="text-[10px] font-semibold leading-none text-[#20242D]">
                      {method.label}
                    </span>
                    <span className="text-[8px] uppercase tracking-wider text-[#A2A8B3]">
                      {method.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button
              type="button"
              onClick={onTopUp}
              className="
                mt-5 inline-flex h-11 w-full items-center justify-center
                gap-2 rounded-full bg-[#538CDB] px-6 text-sm font-semibold
                text-white shadow-[0_7px_18px_rgba(83,140,219,0.20)]
                transition-all duration-200 hover:bg-[#467BC7]
                hover:shadow-[0_9px_22px_rgba(83,140,219,0.25)]
                active:scale-[0.99]
              "
            >
              <Icon name="wallet" size={16} className="text-white" />
              Isi saldo
            </button>
          </div>
        </section>
      </div>
    </figure>
  );
};

export default NeedPayBalanceCard;