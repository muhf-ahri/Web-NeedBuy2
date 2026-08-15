import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Icon from '../ui/Icon';
import { formatRupiah } from '../../utils/currency';
import { getAccessToken } from '../../api/auth';
import { getWallet } from '../../api/wallet';
import needpayCard from '../../assets/needpay.jpg';

const serialFrom = (walletId: string | undefined): string =>
  walletId
    ? `NP ${walletId.replace(/-/g, '').slice(0, 10).toUpperCase()}`
    : 'NP ··········';

/* =========================================================
   Panel kiri branding — card gambar 1:1 (pola IllustrationPanel
   carousel), identik dengan card Login/Carousel
========================================================= */
const BrandPanel: React.FC<{ footer?: string; image?: string }> = ({
  footer,
  image,
}) => (
  <section
    className="
      relative hidden overflow-hidden bg-gradient-to-br from-[#538CDB]
      via-[#4A7ECB] to-[#3A66AC] px-8 py-10 md:flex md:flex-col
      md:justify-between
    "
  >
    {/* Tepi gelombang */}
    <svg
      className="pointer-events-none absolute inset-y-0 right-0 h-full w-16 md:w-20"
      viewBox="0 0 100 400"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M100 0
           C 40 40, 90 90, 55 140
           C 20 190, 70 230, 90 280
           C 105 320, 50 360, 100 400
           L 130 400 L 130 0 Z"
        fill="white"
      />
    </svg>

    {/* Dekorasi minimalis */}
    <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full border border-white/15" />
    <div className="pointer-events-none absolute bottom-8 left-10 h-24 w-24 rounded-full border border-white/10" />
    <div className="pointer-events-none absolute right-[24%] top-[16%] h-1.5 w-1.5 rounded-full bg-[#FFD500]" />

    {/* ── Card gambar 1:1 (sama seperti panel ilustrasi carousel) ── */}
    <div className="relative z-10 flex flex-1 flex-col items-center justify-center py-6">
      <div
        className="
          aspect-square w-full max-w-[230px] overflow-hidden rounded-2xl
          bg-white shadow-[0_18px_40px_rgba(20,30,50,0.25)] ring-1
          ring-white/40
        "
      >
        {image ? (
          <img
            src={image}
            alt="NeedPay"
            draggable={false}
            className="h-full w-full select-none object-cover"
          />
        ) : (
          /* Fallback kalau gambar tidak ada */
          <div className="flex h-full w-full items-center justify-center">
            <Icon name="wallet" size={44} className="text-[#538CDB]/50" />
          </div>
        )}
      </div>

      <p
        className="
          mt-4 text-[11px] font-semibold uppercase tracking-[0.22em]
          text-white/80
        "
      >
        NeedPay
      </p>
    </div>

    {/* Footer: titik kuning + serial */}
    <div className="relative z-10 mt-auto flex items-center gap-2 pt-8 text-[10px] text-white/60">
      <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
      <span className="truncate font-mono">
        {footer ?? 'NeedPay by NeedBuy'}
      </span>
    </div>
  </section>
);

/* =========================================================
   NeedPay Note — card saldo utama (2 panel seperti Login)
========================================================= */
export const NeedPayNote: React.FC<{
  balance: string | number;
  walletId?: string;
  loading?: boolean;
  onTopUp?: () => void;
}> = ({ balance, walletId, loading = false, onTopUp }) => {
  const navigate = useNavigate();
  const handleTopUp = onTopUp ?? (() => navigate('/needpay'));
  const formatted = formatRupiah(balance);

  return (
    <figure
      className="
        w-full overflow-hidden rounded-[24px] border border-white/80
        bg-white/95 shadow-[0_18px_50px_rgba(32,36,45,0.10)]
        backdrop-blur-sm
      "
    >
      <div className="grid md:grid-cols-[0.85fr_1.15fr]">
        {/* Panel kiri: branding + card gambar 1:1 + serial */}
        <BrandPanel footer={serialFrom(walletId)} image={needpayCard} />

        {/* Panel kanan: saldo */}
        <section className="flex items-center bg-white px-6 py-7 sm:px-8 lg:px-10">
          <div className="mx-auto w-full max-w-md">
            {/* Brand mobile */}
            <div className="mb-5 md:hidden">
              <p className="text-xs font-semibold text-[#538CDB]">NeedPay</p>
            </div>

            {/* Eyebrow */}
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

            <p className="mt-2 max-w-sm text-[13px] leading-5 text-[#737A87]">
              Isi saldo sekali, checkout tinggal satu ketukan.
            </p>

            {/* Kotak saldo */}
            <div className="mt-5 rounded-2xl bg-[#F5F7FB] px-5 py-4">
              <p
                className="
                  text-[10px] font-semibold uppercase tracking-[0.18em]
                  text-[#737A87]
                "
              >
                Saldo kamu
              </p>

              {loading ? (
                <div className="mt-2 h-8 w-2/3 animate-pulse rounded-lg bg-[#538CDB]/15" />
              ) : (
                <p
                  className="
                    mt-1 truncate text-[28px] font-extrabold tracking-tight
                    text-[#20242D] sm:text-[32px]
                  "
                  title={formatted}
                >
                  {formatted}
                </p>
              )}

              <div className="mt-3 flex min-w-0 items-center gap-2">
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
            </div>

            {/* CTA */}
            <button
              type="button"
              onClick={handleTopUp}
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

/* =========================================================
   NeedPay Banner — thumbnail gambar juga 1:1
========================================================= */
export const NeedPayBanner: React.FC<{
  balance?: string | number | null;
  onAction: () => void;
  className?: string;
}> = ({ balance, onAction, className = '' }) => {
  const hasWallet = balance !== null && balance !== undefined;

  return (
    <button
      type="button"
      onClick={onAction}
      className={`
        group relative flex w-full max-w-xs items-center gap-4
        overflow-hidden rounded-[20px] border border-white/80 bg-white/95
        p-4 text-left shadow-[0_12px_32px_rgba(32,36,45,0.08)]
        backdrop-blur-sm transition-all duration-300
        hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(32,36,45,0.12)]
        active:scale-[0.98] focus-visible:outline-2
        focus-visible:outline-offset-4 focus-visible:outline-[#538CDB]
        sm:max-w-sm ${className}
      `}
    >
      {/* Thumbnail gambar 1:1 (frame putih seperti card carousel) */}
      <span
        className="
          relative aspect-square h-14 w-14 shrink-0 overflow-hidden
          rounded-xl bg-white shadow-[0_4px_12px_rgba(83,140,219,0.25)]
          ring-1 ring-[#E8ECF4] transition-transform duration-200
          group-hover:-translate-y-0.5
        "
      >
        <img
          src={needpayCard}
          alt=""
          draggable={false}
          className="h-full w-full select-none object-cover"
        />
      </span>

      {/* Teks */}
      <span className="min-w-0 flex-1">
        <span
          className="
            block text-[10px] font-semibold uppercase tracking-[0.18em]
            text-[#538CDB]
          "
        >
          NeedPay
        </span>

        {hasWallet ? (
          <>
            <span
              className="
                mt-0.5 block truncate text-lg font-extrabold
                tracking-tight text-[#20242D]
              "
            >
              {formatRupiah(balance as string | number)}
            </span>
            <span className="mt-0.5 flex items-center gap-1.5 text-[10px] text-[#737A87]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
              Aktif · siap dipakai checkout
            </span>
          </>
        ) : (
          <span
            className="
              mt-0.5 block text-[13px] font-semibold leading-snug
              text-[#20242D]
            "
          >
            Isi saldo sekali, checkout tinggal satu ketukan
          </span>
        )}
      </span>

      {/* CTA pill */}
      <span
        className="
          shrink-0 rounded-full bg-[#538CDB] px-3.5 py-2 text-[11px]
          font-semibold text-white shadow-[0_6px_16px_rgba(83,140,219,0.20)]
          transition-all duration-200 group-hover:bg-[#467BC7]
        "
      >
        {hasWallet ? 'Isi saldo' : 'Buka NeedPay'}
      </span>
    </button>
  );
};

/* =========================================================
   NeedPay Strip — fetch saldo lalu render banner
========================================================= */
export const NeedPayStrip: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  const navigate = useNavigate();

  const isAuthed = !!getAccessToken();

  const [balance, setBalance] = useState<string | null>(null);
  const [ready, setReady] = useState(!isAuthed);

  useEffect(() => {
    if (!isAuthed) return;

    let cancelled = false;

    getWallet()
      .then((wallet) => {
        if (!cancelled) setBalance(wallet.balance);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthed]);

  if (!ready) return null;

  return (
    <NeedPayBanner
      balance={balance}
      onAction={() => navigate('/needpay')}
      className={className}
    />
  );
};

export default NeedPayNote;