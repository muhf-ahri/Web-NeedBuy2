// src/pages/NeedPayPage.tsx
//
// NeedPay — saldo untuk bayar di NeedBuy tanpa buka aplikasi bank tiap checkout.
//
// Arah desain: neo-brutalism yang bersumber dari uang kertas rupiah, bukan dari
// kartu bank. Saldo tampil sebagai LEMBARAN (lihat components/ui/NeedPayNote),
// nominal pilihan tampil sebagai lembar-lembar kecil, dan seluruh gerak di
// halaman ini cuma satu: kertas menempel ke bayangannya saat ditekan.
//
// Keberaniannya sengaja dihabiskan di satu tempat — lembar saldo. Riwayat di
// bawahnya dibuat setenang mungkin supaya lembarannya tetap jadi satu-satunya
// hal yang diingat orang dari halaman ini.
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Icon from '../components/ui/Icon';
import { Guilloche, NeedPayNote } from '../components/ui/NeedPayNote';
import { formatRupiah } from '../utils/currency';
import { payWithSnap } from '../utils/snap';
import { getAccessToken } from '../api/auth';
import {
  getWallet, getWalletTransactions, startTopup, syncTopup,
  MAX_TOPUP, MIN_TOPUP,
  type Wallet, type WalletTransaction,
} from '../api/wallet';

/** Nominal yang paling sering dipakai. Angka bulat, bukan "paket" berhadiah. */
const QUICK_AMOUNTS = [50_000, 100_000, 250_000, 500_000, 1_000_000];

const TX_LABEL: Record<WalletTransaction['type'], string> = {
  TOPUP: 'Isi saldo',
  PAYMENT: 'Bayar pesanan',
  REFUND: 'Saldo dikembalikan',
};

const STATUS_LABEL: Record<WalletTransaction['status'], string> = {
  PENDING: 'Menunggu pembayaran',
  SUCCESS: 'Berhasil',
  FAILED: 'Gagal',
  EXPIRED: 'Kedaluwarsa',
};

/** Label bergaya cap stempel — dipakai untuk status yang belum selesai. */
const Stamp: React.FC<{ text: string; tone: 'warn' | 'fail' }> = ({ text, tone }) => (
  <span
    className="np-serial shrink-0 border-2 px-1.5 py-0.5 text-[9px] font-bold uppercase"
    style={{
      borderColor: tone === 'fail' ? 'var(--np-stamp)' : 'var(--np-ink)',
      color: tone === 'fail' ? 'var(--np-stamp)' : 'var(--np-ink)',
    }}
  >
    {text}
  </span>
);

const TransactionRow: React.FC<{ tx: WalletTransaction }> = ({ tx }) => {
  const isCredit = tx.type !== 'PAYMENT';
  const settled = tx.status === 'SUCCESS';

  return (
    <li
      className="flex items-center gap-3 border-b-2 py-3.5 last:border-0"
      style={{ borderColor: 'var(--np-paper-deep)' }}
    >
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-[14px] font-extrabold" style={{ color: 'var(--np-ink)' }}>
            {TX_LABEL[tx.type]}
          </span>
          {!settled && (
            <Stamp
              text={STATUS_LABEL[tx.status]}
              tone={tx.status === 'PENDING' ? 'warn' : 'fail'}
            />
          )}
        </span>
        <span className="np-serial mt-1 block text-[10px] font-semibold uppercase opacity-60">
          {new Date(tx.createdAt).toLocaleString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
          })}
        </span>
      </span>

      <span className="shrink-0 text-right">
        <span
          className="np-figure block text-[15px] font-extrabold"
          style={{
            color: !settled
              ? 'var(--np-paper-deep)'
              : isCredit
                ? 'var(--np-rupiah)'
                : 'var(--np-ink)',
          }}
        >
          {isCredit ? '+' : '−'} {formatRupiah(tx.amount)}
        </span>
        {settled && tx.balanceAfter && (
          <span className="np-serial block text-[9px] font-bold uppercase opacity-55">
            Sisa {formatRupiah(tx.balanceAfter)}
          </span>
        )}
      </span>
    </li>
  );
};

const NeedPayPage: React.FC = () => {
  const navigate = useNavigate();
  const isAuthed = !!getAccessToken();

  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isAuthed) {
      setLoading(false);
      return;
    }
    try {
      const [walletRes, txRes] = await Promise.all([
        getWallet(),
        getWalletTransactions({ limit: 20 }),
      ]);

      // Top-up yang masih menggantung ditanyakan langsung ke Midtrans. Kalau
      // ternyata sudah dibayar tapi notifikasinya nggak sampai ke server,
      // saldonya masuk sekarang — user nggak perlu tahu webhook itu apa.
      const pending = txRes.data.filter((tx) => tx.type === 'TOPUP' && tx.status === 'PENDING');
      if (pending.length > 0) {
        // allSettled: satu yang gagal disinkron tidak boleh menjatuhkan halaman.
        const results = await Promise.allSettled(pending.map((tx) => syncTopup(tx.id)));
        const changed = results.some((r) => r.status === 'fulfilled' && r.value.synced);
        if (changed) {
          const [freshWallet, freshTx] = await Promise.all([
            getWallet(),
            getWalletTransactions({ limit: 20 }),
          ]);
          setWallet(freshWallet);
          setTransactions(freshTx.data);
          setLoading(false);
          return;
        }
      }

      setWallet(walletRes);
      setTransactions(txRes.data);
    } catch (err: any) {
      setError(err.message ?? 'Gagal muat saldo NeedPay, coba lagi ya');
    } finally {
      setLoading(false);
    }
  }, [isAuthed]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleTopup = async () => {
    const nominal = Number(amount);
    if (!Number.isInteger(nominal) || nominal < MIN_TOPUP || nominal > MAX_TOPUP) {
      setError(`Isi nominal antara ${formatRupiah(MIN_TOPUP)} dan ${formatRupiah(MAX_TOPUP)}.`);
      return;
    }
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const tx = await startTopup(nominal);
      if (!tx.snapToken) throw new Error('Halaman pembayaran belum siap. Coba lagi ya.');

      await payWithSnap(tx.snapToken, {
        onSuccess: () => {
          // Saldo ditambah server setelah notifikasi Midtrans terverifikasi,
          // bukan dari callback ini — makanya statusnya dibaca ulang, bukan
          // ditebak di sini.
          setNotice('Pembayaran diterima. Saldo lagi dikonfirmasi ke Midtrans...');
          setAmount('');
          refresh();
          // Konfirmasi gateway kadang telat beberapa detik — cek sekali lagi.
          window.setTimeout(refresh, 4000);
        },
        onPending: () => {
          setNotice('Pembayaran belum selesai. Saldo masuk setelah kamu menuntaskannya.');
          refresh();
        },
        onError: () => setError('Pembayaran gagal. Saldo kamu nggak berubah.'),
        onClose: () => refresh(),
      });
    } catch (err: any) {
      setError(err.message ?? 'Gagal mulai isi saldo, coba lagi ya');
    } finally {
      setBusy(false);
    }
  };

  if (!isAuthed) {
    return (
      <div className="flex min-h-screen flex-col bg-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Navbar />
        <main className="mx-auto w-full max-w-xl flex-1 px-5 py-16 sm:px-10">
          {/* Lembar kosong, TANPA angka. "Saldo kamu Rp 0" ke orang yang belum
              login itu pernyataan yang tidak benar — dompetnya belum ada. */}
          <figure className="np-note relative overflow-hidden rounded-[4px]" style={{ color: 'var(--np-ink)' }}>
            <Guilloche />
            <div className="relative px-6 py-12 text-center">
              <p className="np-serial text-[10px] font-bold uppercase opacity-70">Bank NeedBuy</p>
              <p className="mt-3 text-[22px] font-extrabold leading-tight">
                Dompetmu nunggu dibuka
              </p>
            </div>
          </figure>

          <p className="mt-8 text-center text-[15px] font-semibold" style={{ color: 'var(--np-ink)' }}>
            Login dulu buat pakai saldo NeedPay.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="np-chip np-press mx-auto mt-4 block px-7 py-2.5 text-[13px] font-extrabold uppercase focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#12100e]"
            style={{ color: 'var(--np-ink)', backgroundColor: 'var(--np-mint)' }}
          >
            Login
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-10 sm:px-10">
        <header className="mb-7">
          <h1
            className="text-[34px] font-extrabold uppercase leading-none tracking-tight sm:text-[42px]"
            style={{ color: 'var(--np-ink)' }}
          >
            NeedPay
          </h1>
          <p className="mt-2 text-[14px] font-medium" style={{ color: 'var(--np-ink)', opacity: 0.7 }}>
            Dompet buat bayar di NeedBuy. Sekali isi, checkout berikutnya tinggal satu ketukan.
          </p>
        </header>

        {error && (
          <div
            className="np-chip mb-5 px-4 py-3"
            style={{ borderColor: 'var(--np-stamp)', boxShadow: '3px 3px 0 var(--np-stamp)' }}
          >
            <p className="text-[13px] font-bold" style={{ color: 'var(--np-stamp)' }}>{error}</p>
          </div>
        )}
        {notice && (
          <div className="np-chip mb-5 px-4 py-3">
            <p className="text-[13px] font-bold" style={{ color: 'var(--np-ink)' }}>{notice}</p>
          </div>
        )}

        {/* ── Lembar saldo ─────────────────────────────────────────────────── */}
        <NeedPayNote balance={wallet?.balance ?? 0} walletId={wallet?.id} loading={loading} />

        {/* ── Isi saldo ────────────────────────────────────────────────────── */}
        <section className="mt-12">
          <h2
            className="np-serial text-[11px] font-bold uppercase"
            style={{ color: 'var(--np-ink)' }}
          >
            Isi saldo
          </h2>

          {/* Nominal cepat, dicetak sebagai lembar-lembar kecil. */}
          <div className="mt-3 flex flex-wrap gap-3">
            {QUICK_AMOUNTS.map((value) => {
              const picked = Number(amount) === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAmount(String(value))}
                  aria-pressed={picked}
                  className="np-chip np-press np-figure px-3.5 py-2 text-[13px] font-extrabold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#12100e]"
                  style={{
                    color: picked ? 'var(--np-ink)' : 'var(--np-rupiah)',
                    backgroundColor: picked ? 'var(--np-mint)' : 'var(--np-paper)',
                  }}
                >
                  {formatRupiah(value)}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              id="topup-amount"
              type="number"
              inputMode="numeric"
              min={MIN_TOPUP}
              max={MAX_TOPUP}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Nominal lain — min ${formatRupiah(MIN_TOPUP)}`}
              aria-label="Nominal isi saldo"
              className="np-chip np-figure flex-1 px-4 py-3 text-[15px] font-bold outline-none placeholder:font-medium placeholder:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#12100e]"
              style={{ color: 'var(--np-ink)' }}
            />
            <button
              onClick={handleTopup}
              disabled={busy || !amount}
              className="np-chip np-press flex items-center justify-center gap-2 px-7 py-3 text-[13px] font-extrabold uppercase tracking-wide disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#12100e]"
              style={{ color: 'var(--np-ink)', backgroundColor: 'var(--np-mint)' }}
            >
              {busy && <Icon name="clock" size={15} className="animate-spin" />}
              Isi saldo
            </button>
          </div>

          <p className="np-serial mt-3 text-[9px] font-bold uppercase" style={{ color: 'var(--np-ink)', opacity: 0.55 }}>
            Bayar lewat Midtrans · Saldo bertambah setelah pembayaran dikonfirmasi
          </p>
        </section>

        {/* ── Riwayat ──────────────────────────────────────────────────────── */}
        <section className="mt-12">
          <h2
            className="np-serial text-[11px] font-bold uppercase"
            style={{ color: 'var(--np-ink)' }}
          >
            Riwayat saldo
          </h2>

          {loading ? (
            <div className="mt-4 space-y-2">
              <div className="h-14 animate-pulse rounded-[2px]" style={{ backgroundColor: 'var(--np-paper)' }} />
              <div className="h-14 animate-pulse rounded-[2px]" style={{ backgroundColor: 'var(--np-paper)' }} />
            </div>
          ) : transactions.length === 0 ? (
            <div
              className="mt-4 border-[3px] border-dashed px-5 py-12 text-center"
              style={{ borderColor: 'var(--np-paper-deep)' }}
            >
              <p className="text-[15px] font-extrabold" style={{ color: 'var(--np-ink)' }}>
                Dompetnya masih kosong.
              </p>
              <p className="mt-1.5 text-[13px] font-medium" style={{ color: 'var(--np-ink)', opacity: 0.6 }}>
                Pilih nominal di atas, saldonya langsung kelihatan di sini.
              </p>
            </div>
          ) : (
            <ul className="mt-1">
              {transactions.map((tx) => (
                <TransactionRow key={tx.id} tx={tx} />
              ))}
            </ul>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default NeedPayPage;
