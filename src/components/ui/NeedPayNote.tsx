import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatRupiah } from '../../utils/currency';
import { getAccessToken } from '../../api/auth';
import { getWallet } from '../../api/wallet';
import needpayCard from '../../assets/needpay.png';

const IMAGE_ASPECT = '1269 / 952';

const CARD_BOX = {
  left: '8.0%',
  top: '31.1%',
  width: '59.9%',
  height: '50.6%',
};

const NP_BLUE = '#2760E3';
const NP_BLUE_DARK = '#1B3FA0';
const NP_BLUE_MUTE = 'rgba(27,63,160,0.55)';
const NP_BLUE_FAINT = 'rgba(27,63,160,0.5)';
const NP_BLUE_TINT_BG = 'rgba(39,96,227,0.1)';
const NP_BLUE_TINT_SKELETON = 'rgba(39,96,227,0.15)';
const NP_GREEN = '#A1E417';

const serialFrom = (walletId: string | undefined): string =>
  walletId
    ? `NP ${walletId.replace(/-/g, '').slice(0, 10).toUpperCase()}`
    : 'NP ··········';

const balanceFontSize = (len: number): string => {
  if (len <= 8) return 'clamp(0.95rem, 7.2cqw, 2rem)';
  if (len <= 11) return 'clamp(0.85rem, 6.2cqw, 1.65rem)';
  if (len <= 14) return 'clamp(0.72rem, 5.2cqw, 1.35rem)';
  if (len <= 17) return 'clamp(0.62rem, 4.4cqw, 1.1rem)';
  if (len <= 20) return 'clamp(0.55rem, 3.6cqw, 0.9rem)';
  return 'clamp(0.48rem, 3cqw, 0.75rem)';
};

const BalanceAmount: React.FC<{ value: string | number }> = ({ value }) => {
  const formatted = formatRupiah(value);

  return (
    <p
      className="w-full min-w-0 truncate font-extrabold leading-tight tracking-tight"
      style={{ color: NP_BLUE_DARK, fontSize: balanceFontSize(formatted.length) }}
      title={formatted}
    >
      {formatted}
    </p>
  );
};

/* =========================================================
   CTA pill — real <button> when onCtaClick is provided
   (NeedPayNote), decorative <span> otherwise (NeedPayBanner,
   which is already the clickable element).
========================================================= */

const CtaPill: React.FC<{
  label: string;
  onCtaClick?: () => void;
}> = ({ label, onCtaClick }) => {
  const classes =
    'shrink-0 whitespace-nowrap rounded-full px-2 py-1 text-[6px] font-bold text-white transition-transform sm:px-3 sm:py-1.5 sm:text-[9px] md:text-[10px]';

  if (onCtaClick) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onCtaClick();
        }}
        className={`${classes} hover:scale-105 active:scale-95`}
        style={{ backgroundColor: NP_BLUE }}
      >
        {label}
      </button>
    );
  }

  return (
    <span className={classes} style={{ backgroundColor: NP_BLUE }}>
      {label}
    </span>
  );
};

const CardOverlay: React.FC<{
  balance?: string | number;
  walletId?: string;
  loading?: boolean;
  emptyMessage?: string;
  ctaLabel: string;
  onCtaClick?: () => void;
}> = ({ balance, walletId, loading, emptyMessage, ctaLabel, onCtaClick }) => {
  const hasWallet = balance !== undefined && balance !== null;

  return (
    <div
      className="absolute flex min-w-0 flex-col"
      style={{
        left: CARD_BOX.left,
        top: CARD_BOX.top,
        width: CARD_BOX.width,
        height: CARD_BOX.height,
        paddingTop: '15%',
        paddingLeft: '3%',
        paddingRight: '6%',
        paddingBottom: '6%',
      }}
    >
      {/* Middle zone: vertically centered between the logo and the bottom row */}
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        {hasWallet ? (
          <>
            <p
              className="text-[6px] font-semibold uppercase tracking-[0.15em] sm:text-[9px] md:text-[10px]"
              style={{ color: NP_BLUE_MUTE }}
            >
             Sado Kamu
            </p>

            {loading ? (
              <div
                className="mt-1 h-3 w-2/3 animate-pulse rounded sm:h-6 md:h-8"
                style={{ backgroundColor: NP_BLUE_TINT_SKELETON }}
              />
            ) : (
              <BalanceAmount value={balance as string | number} />
            )}
          </>
        ) : (
          <p
            className="font-bold leading-tight"
            style={{ color: NP_BLUE_DARK, fontSize: 'clamp(0.55rem, 3.8cqw, 0.9rem)' }}
          >
            {emptyMessage}
          </p>
        )}
      </div>

      {/* Bottom row: status + serial on the left, CTA on the right */}
      <div className="flex min-w-0 items-center justify-between gap-1.5 pt-1 sm:gap-2">
        <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
          {hasWallet && (
            <>
              <span
                className="inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-[5px] font-bold sm:px-2 sm:py-1 sm:text-[8px] md:text-[9px]"
                style={{ backgroundColor: NP_BLUE_TINT_BG, color: NP_BLUE_DARK }}
              >
                <span className="h-1 w-1 rounded-full sm:h-1.5 sm:w-1.5" style={{ backgroundColor: NP_GREEN }} />
                Aktif
              </span>

              <p className="truncate font-mono text-[5px] sm:text-[8px] md:text-[9px]" style={{ color: NP_BLUE_FAINT }}>
                {serialFrom(walletId)}
              </p>
            </>
          )}
        </div>

        <CtaPill label={ctaLabel} onCtaClick={onCtaClick} />
      </div>
    </div>
  );
};

/* =========================================================
   NeedPay Note — the image IS the card/duck; we only overlay
   the live balance + wallet data (and a real, tappable
   "Isi saldo" button) on top of it.
========================================================= */

export const NeedPayNote: React.FC<{
  balance: string | number;
  walletId?: string;
  loading?: boolean;
  onTopUp?: () => void;
}> = ({ balance, walletId, loading = false, onTopUp }) => {
  const navigate = useNavigate();
  const handleTopUp = onTopUp ?? (() => navigate('/needpay'));

  return (
    <figure
      className="group relative w-full overflow-hidden rounded-[24px] transition-transform duration-300 hover:scale-[1.01]"
      style={{ aspectRatio: IMAGE_ASPECT, containerType: 'inline-size' }}
    >
      <img
        src={needpayCard}
        alt="NeedPay"
        draggable={false}
        className="absolute inset-0 h-full w-full select-none object-contain"
      />

      <CardOverlay
        balance={balance}
        walletId={walletId}
        loading={loading}
        ctaLabel="Isi saldo →"
        onCtaClick={handleTopUp}
      />
    </figure>
  );
};

/* =========================================================
   NeedPay Banner — same illustration, same overlay logic,
   just rendered smaller as a clickable, tappable entry point.
   The whole banner is already a <button>, so the CTA inside
   CardOverlay renders as a decorative pill, not a nested
   button.
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
      className={`group relative block w-full max-w-xs overflow-hidden rounded-[18px] text-left shadow-[0_8px_22px_rgba(39,96,227,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(39,96,227,0.18)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 sm:max-w-sm ${className}`}
      style={{ aspectRatio: IMAGE_ASPECT, containerType: 'inline-size', outlineColor: NP_BLUE_DARK }}
    >
      <img
        src={needpayCard}
        alt="NeedPay"
        draggable={false}
        className="absolute inset-0 h-full w-full select-none object-contain transition-transform duration-300 group-hover:scale-[1.02]"
      />

      <CardOverlay
        balance={hasWallet ? (balance as string | number) : undefined}
        emptyMessage="Isi saldo sekali, checkout tinggal satu ketukan"
        ctaLabel={hasWallet ? 'Isi saldo →' : 'Buka NeedPay →'}
      />
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
      onAction={() => navigate('/needpay')}
      className={className}
    />
  );
};

export default NeedPayNote;