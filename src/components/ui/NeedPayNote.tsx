import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Icon from '../ui/Icon';
import { formatRupiah } from '../../utils/currency';
import { getAccessToken } from '../../api/auth';
import { getWallet } from '../../api/wallet';
import needpayCard from '../../assets/needpay.jpg';

import logoBca from '../../assets/Logo BCA.jpg';
import logoMandiri from '../../assets/Logo Mandiri.png';
import logoBni from '../../assets/Logo BNI.png';
import logoBri from '../../assets/Logo BRI.jpg';
import logoDana from '../../assets/logo dana.webp';
import logoGopay from '../../assets/Logo Gopay.webp';
import logoQris from '../../assets/QRIS.jpg';
import logoCc from '../../assets/Logo Kartu Kredit.png';

const serialFrom = (walletId: string | undefined): string =>
  walletId
    ? `NP ${walletId.replace(/-/g, '').slice(0, 10).toUpperCase()}`
    : 'NP ··········';

export type PaymentMethod = {
  label: string;
  type: string;
  logo: string;
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  { label: 'BCA', type: 'Bank', logo: logoBca },
  { label: 'Mandiri', type: 'Bank', logo: logoMandiri },
  { label: 'BNI', type: 'Bank', logo: logoBni },
  { label: 'BRI', type: 'Bank', logo: logoBri },
  { label: 'DANA', type: 'E-Wallet', logo: logoDana },
  { label: 'GoPay', type: 'E-Wallet', logo: logoGopay },
  { label: 'QRIS', type: 'Scan', logo: logoQris },
  { label: 'Kartu Kredit', type: 'Card', logo: logoCc },
];

const BrandPanel: React.FC<{ footer?: string; image?: string }> = ({
  footer,
  image,
}) => (
  <section className="relative hidden min-h-[420px] overflow-hidden md:block">
    {image ? (
      <img
        src={image}
        alt="NeedPay"
        draggable={false}
        className="
          absolute inset-0 h-full w-full select-none object-cover
          transition-transform duration-700 hover:scale-[1.03]
        "
      />
    ) : (
      <div className="absolute inset-0 bg-gradient-to-br from-[#004ac6] via-[#004ac6] to-[#003ea8]" />
    )}

    <div className="absolute inset-0 bg-gradient-to-t from-[#101319]/55 via-transparent to-transparent" />

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

    <div
      className="
        absolute left-6 top-6 z-10 inline-flex items-center gap-1.5
        rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold
        uppercase tracking-[0.18em] text-[#004ac6] backdrop-blur-sm
      "
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
      NeedPay
    </div>

    <div className="absolute bottom-5 left-6 z-10 flex items-center gap-2 text-[10px] text-white/90">
      <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
      <span className="truncate font-mono">
        {footer ?? 'NeedPay by NeedBuy'}
      </span>
    </div>
  </section>
);

export const PaymentTile: React.FC<{ method: PaymentMethod }> = ({ method }) => (
  <div
    className="
      flex flex-col items-center gap-1.5 rounded-xl border border-[#e0e3e5]
      bg-white px-1.5 py-2.5 shadow-sm transition-all duration-200
      hover:-translate-y-0.5 hover:border-[#004ac6]/40
      hover:shadow-[0_6px_16px_rgba(83,140,219,0.12)]
    "
  >
    <span
      className="
        flex h-8 w-10 items-center justify-center overflow-hidden
        rounded-lg bg-white ring-1 ring-[#e0e3e5]
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

    <span className="text-[10px] font-semibold leading-none text-[#101319]">
      {method.label}
    </span>
    <span className="text-[8px] uppercase tracking-wider text-[#A2A8B3]">
      {method.type}
    </span>
  </div>
);

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
      <div className="relative h-44 md:hidden">
        <img
          src={needpayCard}
          alt="NeedPay"
          draggable={false}
          className="absolute inset-0 h-full w-full select-none object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101319]/55 via-transparent to-transparent" />

        <div
          className="
            absolute left-4 top-4 inline-flex items-center gap-1.5
            rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold
            uppercase tracking-[0.18em] text-[#004ac6] backdrop-blur-sm
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
        <BrandPanel footer={serialFrom(walletId)} image={needpayCard} />

        <section className="flex items-center bg-white px-6 py-7 sm:px-8 lg:px-10">
          <div className="mx-auto w-full max-w-lg">
            <div className="mb-4 md:hidden">
              <p className="text-xs font-semibold text-[#004ac6]">NeedPay</p>
            </div>

            <p
              className="
                mb-2 text-[10px] font-semibold uppercase tracking-[0.18em]
                text-[#004ac6]
              "
            >
              Saldo NeedPay
            </p>

            <h3
              className="
                text-[22px] font-bold leading-tight tracking-tight
                text-[#101319] sm:text-[26px]
              "
            >
              Saldo kamu, siap dipakai.
            </h3>

            <div
              className="
                mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl
                bg-[#F5F7FB] px-5 py-3.5
              "
            >
              {loading ? (
                <div className="h-8 w-32 animate-pulse rounded-lg bg-[#004ac6]/15" />
              ) : (
                <p
                  className="
                    truncate text-[26px] font-extrabold tracking-tight
                    text-[#101319] sm:text-[28px]
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
                  text-[#101319] ring-1 ring-[#e0e3e5]
                "
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#12805c]" />
                Aktif
              </span>

              <p className="truncate font-mono text-[10px] text-[#A2A8B3]">
                {serialFrom(walletId)}
              </p>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <p
                  className="
                    text-[10px] font-semibold uppercase tracking-[0.18em]
                    text-[#737686]
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
                  <PaymentTile key={method.label} method={method} />
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleTopUp}
              className="
                mt-5 inline-flex h-11 w-full items-center justify-center
                gap-2 rounded-full bg-[#004ac6] px-6 text-sm font-semibold
                text-white shadow-[0_7px_18px_rgba(83,140,219,0.20)]
                transition-all duration-200 hover:bg-[#004ac6]
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
        group relative flex min-h-[150px] w-full items-stretch
        overflow-hidden rounded-[20px] border border-white/80 bg-white/95
        text-left shadow-[0_12px_32px_rgba(32,36,45,0.08)] backdrop-blur-sm
        transition-all duration-300 hover:-translate-y-0.5
        hover:shadow-[0_16px_40px_rgba(32,36,45,0.12)] active:scale-[0.99]
        focus-visible:outline-2 focus-visible:outline-offset-4
        focus-visible:outline-[#004ac6] ${className}
      `}
    >
      <span className="relative w-32 shrink-0 overflow-hidden sm:w-40">
        <img
          src={needpayCard}
          alt=""
          draggable={false}
          className="
            absolute inset-0 h-full w-full select-none object-cover
            transition-transform duration-500 group-hover:scale-[1.05]
          "
        />

        <svg
          className="pointer-events-none absolute inset-y-0 right-0 h-full w-5 sm:w-6"
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
      </span>

      <span className="flex min-w-0 flex-1 flex-col justify-center gap-1 px-5 py-5 sm:px-6">
        <span
          className="
            text-[10px] font-semibold uppercase tracking-[0.18em]
            text-[#004ac6]
          "
        >
          NeedPay
        </span>

        {hasWallet ? (
          <>
            <span
              className="
                truncate text-xl font-extrabold tracking-tight
                text-[#101319] sm:text-2xl
              "
            >
              {formatRupiah(balance as string | number)}
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-[#737686]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#12805c]" />
              Aktif · siap dipakai checkout
            </span>
          </>
        ) : (
          <span
            className="
              text-[14px] font-bold leading-snug text-[#101319]
              sm:text-[15px]
            "
          >
            Isi saldo sekali, checkout tinggal satu ketukan
          </span>
        )}
      </span>

      <span
        className="
          mr-4 shrink-0 self-center rounded-full bg-[#004ac6] px-4 py-2.5
          text-[11px] font-semibold text-white
          shadow-[0_6px_16px_rgba(83,140,219,0.20)] transition-all
          duration-200 group-hover:bg-[#004ac6]
          group-hover:shadow-[0_8px_20px_rgba(83,140,219,0.25)] sm:mr-5
        "
      >
        {hasWallet ? 'Isi saldo' : 'Buka NeedPay'}
      </span>
    </button>
  );
};

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