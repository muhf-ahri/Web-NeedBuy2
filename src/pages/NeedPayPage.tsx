// src/pages/NeedPayPage.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Icon from '../components/ui/Icon';
import Button from '../components/ui/Button';
import BalanceCard from '../components/ui/BalanceCard';
import { formatRupiah } from '../utils/currency';
import { payWithSnap } from '../utils/snap';
import { getAccessToken } from '../api/auth';
import {
  getWallet,
  getWalletTransactions,
  startTopup,
  syncTopup,
  MAX_TOPUP,
  MIN_TOPUP,
  type Wallet,
  type WalletTransaction,
} from '../api/wallet';

const QUICK_AMOUNTS = [50_000, 100_000, 250_000, 500_000, 1_000_000];

const TX_LABEL: Record<WalletTransaction['type'], string> = {
  TOPUP: 'Isi Saldo',
  PAYMENT: 'Pembayaran',
  REFUND: 'Pengembalian',
};

const STATUS_LABEL: Record<WalletTransaction['status'], string> = {
  PENDING: 'Menunggu',
  SUCCESS: 'Berhasil',
  FAILED: 'Gagal',
  EXPIRED: 'Kadaluwarsa',
};

const STATUS_STYLE: Record<WalletTransaction['status'], { bg: string; text: string }> = {
  PENDING: { bg: 'bg-[#fff4e0]', text: 'text-[#b45309]' },
  SUCCESS: { bg: 'bg-[#d7f5dc]', text: 'text-[#156b32]' },
  FAILED: { bg: 'bg-[#ffe0e0]', text: 'text-[#a33131]' },
  EXPIRED: { bg: 'bg-[#f2f4f6]', text: 'text-[#737686]' },
};

const TransactionRow: React.FC<{ tx: WalletTransaction }> = ({ tx }) => {
  const isCredit = tx.type !== 'PAYMENT';
  const settled = tx.status === 'SUCCESS';
  const statusStyle = STATUS_STYLE[tx.status];

  return (
    <li className="flex items-center gap-3 border-b border-[#e0e3e5] py-3.5 last:border-0">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[14px] font-semibold text-[#191c1e]">
            {TX_LABEL[tx.type]}
          </span>
          {!settled && (
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusStyle.bg} ${statusStyle.text}`}>
              {STATUS_LABEL[tx.status]}
            </span>
          )}
        </div>
        <span className="mt-0.5 block text-[11px] text-[#737686]">
          {new Date(tx.createdAt).toLocaleString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>

      <div className="shrink-0 text-right">
        <span
          className={`block text-[15px] font-bold ${
            !settled
              ? 'text-[#737686]'
              : isCredit
                ? 'text-[#156b32]'
                : 'text-[#191c1e]'
          }`}
        >
          {isCredit ? '+' : '−'} {formatRupiah(tx.amount)}
        </span>
        {settled && tx.balanceAfter && (
          <span className="block text-[10px] text-[#737686]">
            Sisa {formatRupiah(tx.balanceAfter)}
          </span>
        )}
      </div>
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

      const pending = txRes.data.filter((tx) => tx.type === 'TOPUP' && tx.status === 'PENDING');
      if (pending.length > 0) {
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
      setError(err.message ?? 'Gagal muat saldo NeedPay');
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
      if (!tx.snapToken) throw new Error('Halaman pembayaran belum siap.');

      await payWithSnap(tx.snapToken, {
        onSuccess: () => {
          setNotice('Pembayaran diterima. Saldo sedang dikonfirmasi...');
          setAmount('');
          refresh();
          window.setTimeout(refresh, 4000);
        },
        onPending: () => {
          setNotice('Pembayaran belum selesai. Saldo masuk setelah dituntaskan.');
          refresh();
        },
        onError: () => setError('Pembayaran gagal. Saldo tidak berubah.'),
        onClose: () => refresh(),
      });
    } catch (err: any) {
      setError(err.message ?? 'Gagal mulai isi saldo');
    } finally {
      setBusy(false);
    }
  };

  if (!isAuthed) {
    return (
      <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Navbar />
        <main className="flex-1 max-w-2xl mx-auto w-full px-5 sm:px-10 py-16 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-[#f2f4f6] flex items-center justify-center mx-auto mb-4">
              <Icon name="wallet" size={32} className="text-[#737686]" />
            </div>
            <h2 className="text-2xl font-bold text-[#191c1e]">Login untuk Akses NeedPay</h2>
            <p className="text-[#737686] mt-2 mb-6">Kelola saldo dan bayar lebih cepat dengan NeedPay.</p>
            <Button variant="primary" onClick={() => navigate('/login')} className="px-8">
              Login Sekarang
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fb]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-5 sm:px-10 py-8">
        <div className="mb-6">
          <h1 className="text-[28px] font-bold text-[#191c1e]">NeedPay</h1>
          <p className="text-[15px] text-[#737686]">Dompet digital untuk transaksi cepat di NeedBuy.</p>
        </div>

        {/* Error / Notice */}
        {error && (
          <div className="bg-[#ffdad6] border border-[#ba1a1a]/20 rounded-2xl px-4 py-3 mb-4">
            <p className="text-[13px] text-[#93000a] flex items-center gap-2">
              <Icon name="alert" size={16} className="text-[#93000a]" />
              {error}
            </p>
          </div>
        )}
        {notice && (
          <div className="bg-[#d7f5dc] border border-[#156b32]/20 rounded-2xl px-4 py-3 mb-4">
            <p className="text-[13px] text-[#156b32] flex items-center gap-2">
              <Icon name="check" size={16} className="text-[#156b32]" />
              {notice}
            </p>
          </div>
        )}

        {/* Balance Card */}
        <BalanceCard balance={wallet?.balance ?? 0} walletId={wallet?.id} loading={loading} />

        {/* Top Up Section */}
        <section className="mt-8 bg-white rounded-2xl border border-[#e0e3e5] p-6">
          <h2 className="text-[16px] font-bold text-[#191c1e] flex items-center gap-2">
            <Icon name="plus" size={18} className="text-[#004ac6]" />
            Isi Saldo
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {QUICK_AMOUNTS.map((value) => {
              const picked = Number(amount) === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAmount(String(value))}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    picked
                      ? 'bg-[#004ac6] text-white shadow-md scale-105'
                      : 'bg-[#f2f4f6] text-[#434655] hover:bg-[#dbe1ff] hover:text-[#004ac6]'
                  }`}
                >
                  {formatRupiah(value)}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737686] font-semibold text-sm">Rp</span>
              <input
                type="number"
                inputMode="numeric"
                min={MIN_TOPUP}
                max={MAX_TOPUP}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Min ${formatRupiah(MIN_TOPUP)}`}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#c3c6d7] text-sm outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20 transition"
              />
            </div>
            <button
              onClick={handleTopup}
              disabled={busy || !amount}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#004ac6] hover:bg-[#003ea8] text-white font-semibold text-sm transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {busy && <Icon name="clock" size={16} className="animate-spin" />}
              {busy ? 'Memproses...' : 'Isi Saldo'}
            </button>
          </div>

          <p className="mt-2 text-[11px] text-[#737686] flex items-center gap-1.5">
            <Icon name="lock" size={12} />
            Pembayaran aman melalui Midtrans
          </p>
        </section>

        {/* Transaction History */}
        <section className="mt-6 bg-white rounded-2xl border border-[#e0e3e5] p-6">
          <h2 className="text-[16px] font-bold text-[#191c1e] flex items-center gap-2">
            <Icon name="orders" size={18} className="text-[#004ac6]" />
            Riwayat Transaksi
          </h2>

          {loading ? (
            <div className="mt-4 space-y-2">
              <div className="h-14 bg-[#f2f4f6] rounded-xl animate-pulse" />
              <div className="h-14 bg-[#f2f4f6] rounded-xl animate-pulse" />
              <div className="h-14 bg-[#f2f4f6] rounded-xl animate-pulse" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="mt-4 text-center py-8">
              <Icon name="wallet" size={32} className="text-[#c3c6d7] mx-auto mb-2" />
              <p className="text-[#737686]">Belum ada transaksi.</p>
              <p className="text-[12px] text-[#c3c6d7]">Isi saldo untuk memulai.</p>
            </div>
          ) : (
            <ul className="mt-2">
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