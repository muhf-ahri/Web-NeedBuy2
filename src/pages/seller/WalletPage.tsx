import React, { useState, useEffect, useCallback } from 'react';

import SellerLayout from './SellerLayout';
import Reveal from '../../components/ui/Reveal';

import NeedPayBalanceCard from '../../components/needpay/NeedPayBalanceCard';
import NeedPayTopup from '../../components/needpay/NeedPayTopUp';
import NeedPayWithdraw from '../../components/needpay/NeedPayWithdraw';
import NeedPayHistory from '../../components/needpay/NeedPayHistory';
import SellerWalletErrorState from '../../components/seller_wallet/SellerWalletErrorState';

import Icon from '../../components/ui/Icon';

import { formatRupiah } from '../../utils/currency';
import { payWithSnap } from '../../utils/snap';
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
} from '../../api/wallet';

const QUICK_AMOUNTS = [50_000, 100_000, 250_000, 500_000, 1_000_000];

const WalletPage: React.FC = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);

  const [wdBusy, setWdBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [reloadKey, setReloadKey] = useState(0);

  const retry = () => {
    setReloadKey((k) => k + 1);
    setError(null);
  };

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
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
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh, reloadKey]);

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
        'Pengajuan penarikan sudah masuk antrean admin. Saldo kamu sudah dipotong sekarang.'
      );
      await refresh();
    } catch (err: any) {
      setError(err?.message ?? 'Gagal mengajukan penarikan, silakan coba lagi');
    } finally {
      setWdBusy(false);
    }
  };

  const showFatalError = !loading && !wallet && Boolean(error);

  return (
    <SellerLayout>
      <div className="space-y-5 sm:space-y-6">
        <Reveal direction="up">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#538cbd]/10 px-2.5 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
                  <p className="text-[9px] font-bold uppercase tracking-[0.20em] text-[#4077a6]">
                    Saldo & Penarikan
                  </p>
                </span>
              </div>
              <h1 className="text-[22px] font-extrabold leading-tight tracking-tight text-[#101319] sm:text-[28px]">
                Dompet Penjual
              </h1>
              <p className="mt-1 max-w-xl text-[12px] leading-relaxed text-[#737686] sm:text-[13px]">
                Kelola saldo hasil penjualan toko, isi saldo belanja, atau tarik ke rekening bank.
              </p>
            </div>
          </div>
        </Reveal>

        {showFatalError ? (
          <Reveal direction="up">
            <SellerWalletErrorState onRetry={retry} />
          </Reveal>
        ) : (
          <>
            {error && (
              <Reveal direction="up">
                <div
                  className="
                    flex items-center gap-3 rounded-2xl border
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
                  <p className="flex-1 text-[13px] font-medium text-[#ba1a1a]">
                    {error}
                  </p>
                  <button
                    type="button"
                    onClick={() => setError(null)}
                    className="shrink-0 text-[#ba1a1a] hover:text-[#101319]"
                    aria-label="Tutup"
                  >
                    <Icon name="close" size={14} />
                  </button>
                </div>
              </Reveal>
            )}

            {notice && (
              <Reveal direction="up">
                <div
                  className="
                    flex items-center gap-3 rounded-2xl border
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
                  <p className="flex-1 text-[13px] font-medium text-[#12805c]">
                    {notice}
                  </p>
                  <button
                    type="button"
                    onClick={() => setNotice(null)}
                    className="shrink-0 text-[#12805c] hover:text-[#101319]"
                    aria-label="Tutup"
                  >
                    <Icon name="close" size={14} />
                  </button>
                </div>
              </Reveal>
            )}

            <Reveal direction="up" delay={80}>
              <NeedPayBalanceCard
                balance={wallet?.balance ?? 0}
                accountNumber={wallet?.accountNumber}
                loading={loading}
                onTopUp={() => {
                  document
                    .getElementById('topup-section')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              />
            </Reveal>

            <Reveal direction="up" delay={160}>
              <div id="topup-section">
                <NeedPayTopup
                  amount={amount}
                  onAmountChange={setAmount}
                  onSubmit={handleTopup}
                  busy={busy}
                  quickAmounts={QUICK_AMOUNTS}
                  minTopup={MIN_TOPUP}
                />
              </div>
            </Reveal>

            <Reveal direction="up" delay={240}>
              <NeedPayWithdraw
                balance={wallet?.balance ?? 0}
                onSubmit={handleWithdraw}
                busy={wdBusy}
                minWithdrawal={MIN_WITHDRAWAL}
                maxWithdrawal={MAX_WITHDRAWAL}
              />
            </Reveal>

            <Reveal direction="up" delay={320}>
              <NeedPayHistory transactions={transactions} loading={loading} />
            </Reveal>
          </>
        )}
      </div>
    </SellerLayout>
  );
};

export default WalletPage;