import React, { useCallback, useEffect, useRef, useState } from 'react';


import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Icon from '../components/ui/Icon';

import NeedPayBalanceCard from '../components/needpay/NeedPayBalanceCard';
import NeedPayTopup from '../components/needpay/NeedPayTopUp';
import NeedPayWithdraw from '../components/needpay/NeedPayWithdraw';
import NeedPayHistory from '../components/needpay/NeedPayHistory';
import NeedPayLoginPrompt from '../components/needpay/NeedPayLoginPrompt';

import { formatRupiah } from '../utils/currency';
import { payWithSnap } from '../utils/snap';
import { getAccessToken } from '../api/auth';
import {
  getWallet,
  getWalletTransactions,
  startTopup,
  syncTopup,
  requestWithdrawal,
  MAX_TOPUP,
  MIN_TOPUP,
  MAX_WITHDRAWAL,
  MIN_WITHDRAWAL,
  type Wallet,
  type WalletTransaction,
} from '../api/wallet';

const QUICK_AMOUNTS = [50_000, 100_000, 250_000, 500_000, 1_000_000];

const NeedPayPage: React.FC = () => {
  const isAuthed = !!getAccessToken();
  const topupRef = useRef<HTMLDivElement>(null);

  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);

  const [wdBusy, setWdBusy] = useState(false);
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

      const pending = txRes.data.filter(
        (tx) => tx.type === 'TOPUP' && tx.status === 'PENDING'
      );
      if (pending.length > 0) {
        const results = await Promise.allSettled(
          pending.map((tx) => syncTopup(tx.id))
        );
        const changed = results.some(
          (r) => r.status === 'fulfilled' && r.value.synced
        );
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

  const handleScrollToTopup = () => {
    topupRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleTopup = async () => {
    const nominal = Number(amount);
    if (!Number.isInteger(nominal) || nominal < MIN_TOPUP || nominal > MAX_TOPUP) {
      setError(
        `Isi nominal antara ${formatRupiah(MIN_TOPUP)} dan ${formatRupiah(MAX_TOPUP)}.`
      );
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

  const handleWithdraw = async (data: {
    amount: number;
    bankName: string;
    bankAccount: string;
    bankAccountName: string;
  }) => {
    const nominal = data.amount;
    if (
      !Number.isInteger(nominal) ||
      nominal < MIN_WITHDRAWAL ||
      nominal > MAX_WITHDRAWAL
    ) {
      setError(
        `Nominal penarikan antara ${formatRupiah(MIN_WITHDRAWAL)} dan ${formatRupiah(MAX_WITHDRAWAL)}.`
      );
      return;
    }
    if (!/^[0-9-]{6,30}$/.test(data.bankAccount.trim())) {
      setError('Nomor rekening hanya boleh angka, 6 sampai 30 digit.');
      return;
    }

    setWdBusy(true);
    setError(null);
    setNotice(null);
    try {
      await requestWithdrawal(data);
      setNotice(
        'Pengajuan penarikan udah masuk antrean admin. Saldo kamu udah dipotong sekarang.'
      );
      await refresh();
    } catch (err: any) {
      setError(err?.message ?? 'Gagal ngajuin penarikan, coba lagi ya');
    } finally {
      setWdBusy(false);
    }
  };

  if (!isAuthed) {
    return <NeedPayLoginPrompt />;
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-[#f5f7fb]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-8 sm:px-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="min-w-0">
            <p
              className="
                text-[10px] font-semibold uppercase tracking-[0.18em]
                text-[#4077a6]
              "
            >
              Dompet digital
            </p>
            <h1 className="text-[24px] font-extrabold leading-tight text-[#101319] sm:text-[28px]">
              NeedPay
            </h1>
          </div>
        </div>

        {error && (
          <div
            className="
              mb-4 flex items-center gap-3 rounded-2xl border
              border-[#ba1a1a]/20 bg-[#FFF0F0] px-4 py-3 backdrop-blur-sm
            "
          >
            <span
              className="
                flex h-8 w-8 shrink-0 items-center justify-center
                rounded-full bg-[#ba1a1a]/15
              "
            >
              <Icon name="alert" size={15} className="text-[#ba1a1a]" />
            </span>
            <p className="text-[13px] font-medium text-[#ba1a1a]">{error}</p>
          </div>
        )}

        {notice && (
          <div
            className="
              mb-4 flex items-center gap-3 rounded-2xl border
              border-[#12805c]/20 bg-[#e6f4ee] px-4 py-3 backdrop-blur-sm
            "
          >
            <span
              className="
                flex h-8 w-8 shrink-0 items-center justify-center
                rounded-full bg-[#12805c]/15
              "
            >
              <Icon name="check" size={15} className="text-[#12805c]" />
            </span>
            <p className="text-[13px] font-medium text-[#12805c]">{notice}</p>
          </div>
        )}

        <NeedPayBalanceCard
          balance={wallet?.balance ?? 0}
          walletId={wallet?.id}
          loading={loading}
          onTopUp={handleScrollToTopup}
        />

        <div ref={topupRef}>
          <NeedPayTopup
            amount={amount}
            onAmountChange={setAmount}
            onSubmit={handleTopup}
            busy={busy}
            quickAmounts={QUICK_AMOUNTS}
            minTopup={MIN_TOPUP}
          />
        </div>

        <NeedPayWithdraw
          balance={wallet?.balance ?? 0}
          onSubmit={handleWithdraw}
          busy={wdBusy}
          minWithdrawal={MIN_WITHDRAWAL}
          maxWithdrawal={MAX_WITHDRAWAL}
        />

        <NeedPayHistory transactions={transactions} loading={loading} />
      </main>

      <Footer />
    </div>
  );
};

export default NeedPayPage;