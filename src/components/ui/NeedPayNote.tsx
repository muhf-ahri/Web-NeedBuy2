// src/components/ui/NeedPayNote.tsx
import React, { useEffect, useId, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatRupiah } from '../../utils/currency';
import { getAccessToken } from '../../api/auth';
import { getWallet } from '../../api/wallet';

/**
 * Garis guilloche — pola gelombang yang dipakai di uang kertas.
 * Versi dengan warna putih transparan untuk tampilan yang lebih elegan.
 */
export const Guilloche: React.FC<{ className?: string; opacity?: number; color?: string }> = ({
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
        <pattern id={patternId} width="48" height="24" patternUnits="userSpaceOnUse">
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
      <rect width="100%" height="100%" fill={`url(#${patternId})`} opacity={opacity} />
    </svg>
  );
};

/**
 * Zig-zag dekoratif dengan gradasi dan animasi.
 */
export const ZigZag: React.FC<{ className?: string; color?: string; opacity?: number }> = ({
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
        <linearGradient id={`${id}-grad`} x1="0" y1="0" x2="140" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="30%" stopColor={color} stopOpacity={opacity} />
          <stop offset="70%" stopColor={color} stopOpacity={opacity} />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points="0,20 12,4 24,20 36,4 48,20 60,4 72,20 84,4 96,20 108,4 120,20 132,4 140,20"
        stroke={`url(#${id}-grad)`}
        strokeWidth="2"
        fill="none"
        className="animate-pulse-soft"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/** Benang pengaman: pita vertikal bergaris. */
const SecurityThread: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span
    aria-hidden="true"
    className={`absolute top-0 h-full w-[6px] ${className}`}
    style={{
      backgroundImage:
        'repeating-linear-gradient(180deg, rgba(255,255,255,0.3) 0 10px, transparent 10px 18px)',
    }}
  />
);

const serialFrom = (walletId: string | undefined): string =>
  walletId ? `NP ${walletId.replace(/-/g, '').slice(0, 10).toUpperCase()}` : 'NP ··········';

/**
 * Lembar saldo NeedPay — desain elegan dengan gradasi biru kobalt.
 */
export const NeedPayNote: React.FC<{
  balance: string | number;
  walletId?: string;
  loading?: boolean;
}> = ({ balance, walletId, loading = false }) => (
  <figure
    className="relative overflow-hidden rounded-2xl transition-all hover:shadow-xl"
    style={{
      background: 'linear-gradient(145deg, #004ac6 0%, #002a7a 50%, #001a4a 100%)',
      color: '#ffffff',
    }}
  >
    {/* Background pattern */}
    <Guilloche color="rgba(255,255,255,0.3)" opacity={0.2} />

    {/* Security thread */}
    <SecurityThread className="left-[12%]" />

    {/* Dekorasi zig-zag dengan animasi */}
    <ZigZag className="bottom-3 right-6" color="rgba(255,255,255,0.4)" opacity={0.6} />
    <ZigZag className="top-3 left-6 rotate-180" color="rgba(255,255,255,0.4)" opacity={0.6} />

    {/* Lingkaran dekoratif dengan animasi float */}
    <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/5 animate-float" />
    <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-white/5 animate-pulse-soft" />
    <div className="absolute right-1/4 top-1/4 h-20 w-20 rounded-full bg-white/5 animate-drift" />
    <div className="absolute left-1/3 bottom-1/4 h-14 w-14 rounded-full bg-white/5 animate-float" style={{ animationDelay: '1.5s' }} />
    <div className="absolute right-1/3 bottom-1/3 h-10 w-10 rounded-full bg-white/10 animate-pulse-soft" style={{ animationDelay: '0.8s' }} />

    {/* Garis dekoratif */}
    <div className="absolute right-0 top-0 h-40 w-40 rotate-12 border-r-2 border-t-2 border-white/10 rounded-tr-full" />
    <div className="absolute bottom-0 left-0 h-28 w-28 -rotate-6 border-b-2 border-l-2 border-white/10 rounded-bl-full" />

    <div className="relative z-10 p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-white/15 p-1.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 8h8M8 12h6M8 16h4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-white/80">
            NeedPay · Dompet Digital
          </p>
        </div>
        <span
          className="shrink-0 rounded-full border-2 border-white/30 px-3 py-1 text-[10px] font-bold uppercase text-white/70"
        >
          RP
        </span>
      </div>

      {/* Saldo */}
      <div className="mt-6">
        <p className="text-[10px] font-medium uppercase tracking-wider text-white/50">
          Total Saldo
        </p>
        {loading ? (
          <div className="mt-1.5 h-12 w-56 animate-pulse rounded bg-white/10" />
        ) : (
          <p className="mt-1 text-[42px] font-extrabold leading-none tracking-tight sm:text-[54px]">
            {formatRupiah(balance)}
          </p>
        )}
      </div>

      {/* Status dan Nomor Seri */}
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-400/20 px-2.5 py-1 text-[10px] font-semibold text-green-300">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            Aktif
          </span>
          <p className="np-serial text-[10px] font-mono font-medium text-white/50">
            {serialFrom(walletId)}
          </p>
        </div>
        <p className="text-[9px] font-medium uppercase tracking-wider text-white/40">
          Sah di NeedBuy
        </p>
      </div>
    </div>
  </figure>
);

/**
 * Pita NeedPay — versi ringkas untuk beranda.
 */
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
      className={`group relative block w-full overflow-hidden rounded-2xl text-left transition-all hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#004ac6] ${className}`}
      style={{
        background: 'linear-gradient(145deg, #004ac6 0%, #002a7a 50%, #001a4a 100%)',
        color: '#ffffff',
      }}
    >
      {/* Pattern dan dekorasi */}
      <Guilloche color="rgba(255,255,255,0.25)" opacity={0.15} />
      <SecurityThread className="left-[8%] hidden sm:block" />

      {/* Zig-zag kecil */}
      <ZigZag className="bottom-1 right-4" color="rgba(255,255,255,0.3)" opacity={0.4} />
      <ZigZag className="top-1 left-4 rotate-180" color="rgba(255,255,255,0.3)" opacity={0.4} />

      {/* Lingkaran dekoratif */}
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/5 animate-float" />
      <div className="absolute -bottom-8 -left-8 h-20 w-20 rounded-full bg-white/5 animate-pulse-soft" />

      <div className="relative flex flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-7 sm:py-5">
        <span className="min-w-0">
          <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-white/60">
            <span className="rounded-full bg-white/10 p-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" strokeLinecap="round"/>
              </svg>
            </span>
            NeedPay
          </span>
          {hasWallet ? (
            <span className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold sm:text-3xl">
                {formatRupiah(balance)}
              </span>
              <span className="text-sm font-medium text-white/60">saldo kamu</span>
            </span>
          ) : (
            <span className="mt-1 block text-base font-bold leading-tight sm:text-lg">
              Isi saldo sekali, checkout tinggal satu ketukan
            </span>
          )}
        </span>

        <span
          className="shrink-0 rounded-full bg-white px-5 py-2 text-sm font-bold text-[#004ac6] transition-transform group-hover:scale-105"
        >
          {hasWallet ? 'Isi saldo →' : 'Buka NeedPay →'}
        </span>
      </div>
    </button>
  );
};

/**
 * Pita NeedPay siap pasang — mengambil saldo sendiri.
 */
export const NeedPayStrip: React.FC<{ className?: string }> = ({ className = '' }) => {
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