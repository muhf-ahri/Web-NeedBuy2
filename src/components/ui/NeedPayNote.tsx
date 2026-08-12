// src/components/ui/NeedPayNote.tsx
//
// Kartu saldo NeedPay, dibuat sebagai LEMBAR UANG — bukan kartu bank.
//
// Alasannya: yang ditampilkan di sini uang, dan uang di Indonesia punya rupa
// yang sudah dikenal semua orang — kertas krem, tinta cetak, garis guilloche,
// nomor seri, kotak nominal di pojok. Meminjam rupa itu bikin saldo langsung
// terbaca sebagai uang, tanpa perlu satu kata penjelasan pun.
//
// Neo-brutalism-nya bukan tempelan: border tebal + bayangan offset keras
// adalah cara cetak offset terlihat kalau platnya sedikit meleset. Jadi gaya
// dan subjeknya kebetulan bicara hal yang sama.
import React, { useEffect, useId, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatRupiah } from '../../utils/currency';
import { getAccessToken } from '../../api/auth';
import { getWallet } from '../../api/wallet';

/**
 * Garis guilloche — pola gelombang yang dipakai di uang kertas untuk
 * mempersulit pemalsuan. Di sini murni tekstur; dibuat dari satu <pattern>
 * SVG, bukan gambar, supaya tetap tajam di layar mana pun dan tidak menambah
 * satu byte pun permintaan jaringan.
 */
export const Guilloche: React.FC<{ className?: string; opacity?: number }> = ({
  className = '',
  opacity = 0.14,
}) => {
  // id unik per instance: lembar saldo dan pita bisa tampil di halaman yang
  // sama, dan dua <pattern> ber-id sama bikin salah satunya mengambil milik
  // yang lain.
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
          stroke="var(--np-ink)"
          strokeWidth="1"
        />
        <path
          d="M0 20 Q 12 8 24 20 T 48 20"
          fill="none"
          stroke="var(--np-ink)"
          strokeWidth="0.6"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill={`url(#${patternId})`} opacity={opacity} />
  </svg>
  );
};

/** Benang pengaman: pita putus-putus vertikal di uang kertas asli. */
const SecurityThread: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span
    aria-hidden="true"
    className={`absolute top-0 h-full w-[7px] ${className}`}
    style={{
      backgroundImage:
        'repeating-linear-gradient(180deg, var(--np-ink) 0 10px, transparent 10px 18px)',
      opacity: 0.5,
    }}
  />
);

/**
 * Nomor seri. Diturunkan dari id dompet, jadi angkanya benar-benar menandai
 * dompet ini — bukan angka hias yang sama untuk semua orang.
 */
const serialFrom = (walletId: string | undefined): string =>
  walletId ? `NP ${walletId.replace(/-/g, '').slice(0, 10).toUpperCase()}` : 'NP ··········';

/**
 * Lembar saldo utuh. Dipakai di halaman NeedPay.
 *
 * @param balance saldo dari API (string Decimal).
 * @param walletId sumber nomor seri.
 * @param loading tampilkan kerangka, bukan angka nol yang menyesatkan.
 */
export const NeedPayNote: React.FC<{
  balance: string | number;
  walletId?: string;
  loading?: boolean;
}> = ({ balance, walletId, loading = false }) => (
  <figure
    className="np-note relative overflow-hidden rounded-[4px]"
    style={{ color: 'var(--np-ink)' }}
  >
    <Guilloche />
    <SecurityThread className="left-[18%]" />

    <div className="relative p-5 sm:p-7">
      {/* Baris penerbit — microtext di uang asli. */}
      <div className="flex items-start justify-between gap-4">
        <p className="np-serial text-[9px] font-bold uppercase sm:text-[10px]">
          Bank NeedBuy · Alat pembayaran di dalam aplikasi
        </p>

        {/* Kotak nominal pojok kanan atas. */}
        <span
          className="np-serial shrink-0 border-[2.5px] px-2 py-1 text-[11px] font-bold"
          style={{ borderColor: 'var(--np-ink)' }}
        >
          RP
        </span>
      </div>

      <p className="np-serial mt-6 text-[10px] font-bold uppercase opacity-70">Saldo kamu</p>

      {loading ? (
        <div
          className="mt-1.5 h-11 w-56 animate-pulse rounded-[2px] sm:h-14"
          style={{ backgroundColor: 'var(--np-paper-deep)' }}
        />
      ) : (
        <p
          className="np-figure mt-1 text-[40px] font-extrabold leading-none sm:text-[54px]"
          style={{ color: 'var(--np-rupiah)' }}
        >
          {formatRupiah(balance)}
        </p>
      )}

      <div className="mt-7 flex items-end justify-between gap-4">
        <p className="np-serial text-[10px] font-bold sm:text-[11px]">{serialFrom(walletId)}</p>
        <p className="np-serial text-[9px] font-bold uppercase opacity-60">
          Sah dipakai di NeedBuy
        </p>
      </div>
    </div>
  </figure>
);

/**
 * Pita NeedPay untuk beranda & halaman kategori: potongan lembar yang sama,
 * dipendekkan. Isinya tetap kabar yang benar — saldo asli kamu — jadi ini
 * informasi, bukan spanduk hiasan.
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
      className={`np-note np-press group relative block w-full overflow-hidden rounded-[4px] text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#12100e] ${className}`}
      style={{ color: 'var(--np-ink)' }}
    >
      <Guilloche opacity={0.1} />
      <SecurityThread className="left-[10%] hidden sm:block" />

      <span className="relative flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3.5 sm:px-6">
        <span className="min-w-0">
          <span className="np-serial block text-[9px] font-bold uppercase opacity-70">
            NeedPay
          </span>
          {hasWallet ? (
            <span className="mt-0.5 flex items-baseline gap-2">
              <span
                className="np-figure text-[24px] font-extrabold leading-none sm:text-[28px]"
                style={{ color: 'var(--np-rupiah)' }}
              >
                {formatRupiah(balance)}
              </span>
              <span className="text-[12px] font-semibold opacity-70">saldo kamu</span>
            </span>
          ) : (
            <span className="mt-0.5 block text-[15px] font-extrabold leading-tight sm:text-[17px]">
              Isi saldo sekali, checkout tinggal satu ketukan
            </span>
          )}
        </span>

        <span
          className="np-serial shrink-0 border-[2.5px] px-3.5 py-2 text-[11px] font-bold uppercase"
          style={{ borderColor: 'var(--np-ink)', backgroundColor: 'var(--np-mint)' }}
        >
          {hasWallet ? 'Isi saldo →' : 'Buka NeedPay →'}
        </span>
      </span>
    </button>
  );
};

/**
 * Pita NeedPay siap pasang: mengambil saldonya sendiri, jadi halaman yang
 * memakainya cukup menaruh satu baris tanpa ikut mengurus state dompet.
 *
 * Tidak merender apa pun sampai saldonya diketahui kalau user sudah login —
 * pita yang muncul dengan angka nol lalu berubah jadi 500.000 lebih buruk
 * daripada pita yang datang sedikit terlambat.
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
      // Saldo gagal dimuat bukan alasan menyembunyikan NeedPay — pitanya
      // tampil dengan ajakan, bukan dengan angka yang salah.
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
