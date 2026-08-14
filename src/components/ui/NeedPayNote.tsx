// src/components/ui/NeedPayNote.tsx
import React, { useEffect, useId, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatRupiah } from '../../utils/currency';
import { getAccessToken } from '../../api/auth';
import { getWallet } from '../../api/wallet';

/* =========================================================
   Guilloche Pattern
========================================================= */

export const Guilloche: React.FC<{
  className?: string;
  opacity?: number;
  color?: string;
}> = ({
  className = '',
  opacity = 0.15,
  color = 'rgba(255,255,255,0.4)',
}) => {
  const patternId = `np-guilloche-${useId().replace(/:/g, '')}`;

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      preserveAspectRatio="none"
    >
      <defs>
        <pattern
          id={patternId}
          width="48"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 12 Q 12 0 24 12 T 48 12"
            fill="none"
            stroke={color}
            strokeWidth="1"
          />

          <path
            d="M0 20 Q 12 8 24 20 T 48 20"
            fill="none"
            stroke={color}
            strokeWidth="0.6"
          />
        </pattern>
      </defs>

      <rect
        width="100%"
        height="100%"
        fill={`url(#${patternId})`}
        opacity={opacity}
      />
    </svg>
  );
};

/* =========================================================
   Zig Zag
========================================================= */

export const ZigZag: React.FC<{
  className?: string;
  color?: string;
  opacity?: number;
}> = ({
  className = '',
  color = 'rgba(255,255,255,0.3)',
  opacity = 0.5,
}) => {
  const id = `np-zigzag-${useId().replace(/:/g, '')}`;

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute ${className}`}
      width="140"
      height="40"
      viewBox="0 0 140 40"
      fill="none"
    >
      <defs>
        <linearGradient
          id={`${id}-grad`}
          x1="0"
          y1="0"
          x2="140"
          y2="0"
        >
          <stop
            offset="0%"
            stopColor={color}
            stopOpacity="0"
          />

          <stop
            offset="30%"
            stopColor={color}
            stopOpacity={opacity}
          />

          <stop
            offset="70%"
            stopColor={color}
            stopOpacity={opacity}
          />

          <stop
            offset="100%"
            stopColor={color}
            stopOpacity="0"
          />
        </linearGradient>
      </defs>

      <polyline
        points="
          0,20
          12,4
          24,20
          36,4
          48,20
          60,4
          72,20
          84,4
          96,20
          108,4
          120,20
          132,4
          140,20
        "
        stroke={`url(#${id}-grad)`}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/* =========================================================
   Security Thread
========================================================= */

const SecurityThread: React.FC<{
  className?: string;
}> = ({ className = '' }) => (
  <span
    aria-hidden="true"
    className={`absolute top-0 h-full w-[5px] ${className}`}
    style={{
      backgroundImage:
        'repeating-linear-gradient(180deg, rgba(255,255,255,0.25) 0 9px, transparent 9px 17px)',
    }}
  />
);

/* =========================================================
   Serial Number
========================================================= */

const serialFrom = (
  walletId: string | undefined
): string =>
  walletId
    ? `NP ${walletId
        .replace(/-/g, '')
        .slice(0, 10)
        .toUpperCase()}`
    : 'NP ··········';

/* =========================================================
   NeedPay Note
========================================================= */

export const NeedPayNote: React.FC<{
  balance: string | number;
  walletId?: string;
  loading?: boolean;
}> = ({
  balance,
  walletId,
  loading = false,
}) => (
  <figure
    className="
      relative
      overflow-hidden
      rounded-[22px]
      border
      border-[#1D4FA5]
      shadow-[0_12px_35px_rgba(37,99,199,0.18)]
      transition-shadow duration-300
      hover:shadow-[0_16px_45px_rgba(37,99,199,0.24)]
    "
    style={{
      background:
        'linear-gradient(135deg, #2563C7 0%, #3477D6 55%, #1D4FA5 100%)',
      color: '#ffffff',
    }}
  >
    {/* Pattern */}
    <Guilloche
      color="rgba(255,255,255,0.28)"
      opacity={0.18}
    />

    {/* Security thread */}
    <SecurityThread className="left-[12%]" />

    {/* Decorative circles */}
    <div
      aria-hidden="true"
      className="
        absolute
        -right-16 -top-16
        h-44 w-44
        rounded-full
        bg-[#FFD500]/90
      "
    />

    <div
      aria-hidden="true"
      className="
        absolute
        -bottom-12 -left-10
        h-32 w-32
        rounded-full
        bg-[#FF4B4B]/80
      "
    />

    <div
      aria-hidden="true"
      className="
        absolute
        right-[28%] top-[22%]
        h-12 w-12
        rounded-full
        border-2 border-white/20
      "
    />

    {/* Decorative square */}
    <div
      aria-hidden="true"
      className="
        absolute
        bottom-[22%]
        right-[12%]
        h-5 w-5
        rotate-45
        rounded-[3px]
        bg-white/30
      "
    />

    {/* Curved lines */}
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-30"
      viewBox="0 0 400 300"
      fill="none"
    >
      <path
        d="M420 20C320 50 360 110 280 130C210 148 270 210 170 245"
        stroke="white"
        strokeWidth="1"
      />

      <path
        d="M430 45C340 72 375 125 295 150C230 170 285 225 185 270"
        stroke="white"
        strokeWidth="0.7"
      />
    </svg>

    {/* Zig zag */}
    <ZigZag
      className="bottom-3 right-6"
      color="rgba(255,255,255,0.4)"
      opacity={0.5}
    />

    <ZigZag
      className="left-6 top-3 rotate-180"
      color="rgba(255,255,255,0.4)"
      opacity={0.5}
    />

    {/* Content */}
    <div className="relative z-10 p-5 sm:p-7">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div
            className="
              flex h-8 w-8
              items-center justify-center
              rounded-full
              bg-white
              text-[#2563C7]
              shadow-sm
            "
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path
                d="M8 8h8M8 12h6M8 16h4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div>
            <p className="text-[11px] font-extrabold tracking-wide text-white">
              NeedPay
            </p>

            <p className="text-[9px] text-white/65">
              Dompet Digital NeedBuy
            </p>
          </div>
        </div>

        <span
          className="
            rounded-full
            border border-white/40
            bg-white/10
            px-2.5 py-1
            text-[9px]
            font-bold
            tracking-wider
            text-white/80
          "
        >
          RP
        </span>
      </div>

      {/* Balance */}
      <div className="mt-7">
        <p
          className="
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.15em]
            text-white/55
          "
        >
          Total Saldo
        </p>

        {loading ? (
          <div
            className="
              mt-2
              h-10
              w-48
              animate-pulse
              rounded-lg
              bg-white/15
            "
          />
        ) : (
          <p
            className="
              mt-1
              text-[34px]
              font-extrabold
              leading-none
              tracking-tight
              sm:text-[44px]
            "
          >
            {formatRupiah(balance)}
          </p>
        )}
      </div>

      {/* Bottom info */}
      <div
        className="
          mt-6
          flex flex-wrap
          items-end
          justify-between
          gap-3
          border-t
          border-white/15
          pt-4
        "
      >
        <div className="flex items-center gap-3">
          <span
            className="
              inline-flex
              items-center
              gap-1.5
              rounded-full
              bg-white/15
              px-2.5 py-1
              text-[9px]
              font-bold
              text-white
            "
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
            Aktif
          </span>

          <p className="text-[9px] font-mono text-white/55">
            {serialFrom(walletId)}
          </p>
        </div>

        <p
          className="
            text-[8px]
            font-semibold
            uppercase
            tracking-wider
            text-white/45
          "
        >
          Sah di NeedBuy
        </p>
      </div>
    </div>
  </figure>
);

/* =========================================================
   NeedPay Banner
========================================================= */

export const NeedPayBanner: React.FC<{
  balance?: string | number | null;
  onAction: () => void;
  className?: string;
}> = ({
  balance,
  onAction,
  className = '',
}) => {
  const hasWallet =
    balance !== null &&
    balance !== undefined;

  return (
    <button
      type="button"
      onClick={onAction}
      className={`
        group
        relative
        block
        w-full
        overflow-hidden
        rounded-[18px]
        border
        border-[#D5E3F8]
        text-left
        shadow-[0_8px_25px_rgba(37,99,199,0.08)]
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:shadow-[0_12px_32px_rgba(37,99,199,0.14)]
        focus-visible:outline-2
        focus-visible:outline-offset-4
        focus-visible:outline-[#2563C7]
        ${className}
      `}
      style={{
        background:
          'linear-gradient(135deg, #2563C7 0%, #4B88DC 100%)',
        color: '#ffffff',
      }}
    >
      {/* Decorative yellow circle */}
      <div
        aria-hidden="true"
        className="
          absolute
          -right-8
          -top-10
          h-28
          w-28
          rounded-full
          bg-[#FFD500]
        "
      />

      {/* Decorative red shape */}
      <div
        aria-hidden="true"
        className="
          absolute
          -bottom-8
          -left-6
          h-20
          w-20
          rounded-full
          bg-[#FF4B4B]/80
        "
      />

      {/* White circle */}
      <div
        aria-hidden="true"
        className="
          absolute
          right-[25%]
          bottom-[-20px]
          h-20
          w-20
          rounded-full
          border
          border-white/15
        "
      />

      <Guilloche
        color="rgba(255,255,255,0.3)"
        opacity={0.12}
      />

      <SecurityThread className="left-[8%] hidden sm:block" />

      <div
        className="
          relative
          flex
          flex-wrap
          items-center
          justify-between
          gap-4
          px-5
          py-4
          sm:px-6
          sm:py-4.5
        "
      >
        <span className="min-w-0">
          {/* Label */}
          <span
            className="
              flex
              items-center
              gap-2
              text-[9px]
              font-extrabold
              uppercase
              tracking-[0.15em]
              text-white/70
            "
          >
            <span
              className="
                flex h-6 w-6
                items-center justify-center
                rounded-full
                bg-white
                text-[#2563C7]
              "
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
                  strokeLinecap="round"
                />
              </svg>
            </span>

            NeedPay
          </span>

          {hasWallet ? (
            <span className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-extrabold sm:text-2xl">
                {formatRupiah(balance)}
              </span>

              <span className="text-xs font-medium text-white/60">
                saldo kamu
              </span>
            </span>
          ) : (
            <span
              className="
                mt-1
                block
                text-sm
                font-bold
                leading-tight
                sm:text-base
              "
            >
              Isi saldo sekali, checkout tinggal satu ketukan
            </span>
          )}
        </span>

        {/* Action */}
        <span
          className="
            shrink-0
            rounded-full
            bg-white
            px-4
            py-2
            text-[12px]
            font-bold
            text-[#2563C7]
            shadow-sm
            transition-all
            group-hover:px-5
          "
        >
          {hasWallet
            ? 'Isi saldo →'
            : 'Buka NeedPay →'}
        </span>
      </div>
    </button>
  );
};

/* =========================================================
   NeedPay Strip
========================================================= */

export const NeedPayStrip: React.FC<{
  className?: string;
}> = ({
  className = '',
}) => {
  const navigate = useNavigate();

  const isAuthed = !!getAccessToken();

  const [balance, setBalance] =
    useState<string | null>(null);

  const [ready, setReady] =
    useState(!isAuthed);

  useEffect(() => {
    if (!isAuthed) return;

    let cancelled = false;

    getWallet()
      .then((wallet) => {
        if (!cancelled) {
          setBalance(wallet.balance);
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) {
          setReady(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthed]);

  if (!ready) return null;

  return (
    <NeedPayBanner
      balance={balance}
      onAction={() =>
        navigate('/needpay')
      }
      className={className}
    />
  );
};

export default NeedPayNote;