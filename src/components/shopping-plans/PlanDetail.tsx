import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Icon from '../ui/Icon';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';

import PlanItemRow from './PlanItemRow';
import AddProductModal from './AddProductModal';
import CategoryModal from './CategoryModal';

import { formatRupiah } from '../../utils/currency';
import { useShoppingPlan } from '../../hooks/useShoppingPlans';
import { useCart } from '../../contexts/CartContext';
import {
  deletePlan,
  updatePlanItem,
  removePlanItem,
  addPlanToCart,
} from '../../api/plans';
import { getCart } from '../../api/cart';

import needpayCard from '../../assets/needpay.jpg';
import kosongImg from '../../assets/Kosong.png';

const planTitle = (plan: { name: string | null }) => plan.name ?? 'Tanpa Nama';

interface PlanDetailProps {
  planId: string;
  onBack: () => void;
}

const PlanDetail: React.FC<PlanDetailProps> = ({ planId, onBack }) => {
  const navigate = useNavigate();
  const { plan, loading, error, refetch } = useShoppingPlan(planId);
  const { refreshCartCount } = useCart();

  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setActionError(null);
    try {
      await fn();
    } catch (err: any) {
      setActionError(err.message ?? 'Gagal, coba lagi ya');
    } finally {
      setBusy(false);
    }
  };

  const handleCheckoutAll = () =>
    run(async () => {
      if (!plan) return;
      const result = await addPlanToCart(planId);
      await refreshCartCount();

      const cart = await getCart();
      const wanted = new Set(plan.items.map((item) => item.product.id));
      const cartItemIds = cart.data.data.items
        .filter((item) => wanted.has(item.product.id))
        .map((item) => item.id);

      if (cartItemIds.length === 0) {
        setActionError(
          'Nggak ada item yang bisa di-checkout dari kategori ini.'
        );
        return;
      }
      if (result.data.data.failed.length > 0) {
        console.warn(
          '[plan checkout] item gagal masuk keranjang:',
          result.data.data.failed
        );
      }
      navigate('/checkout', { state: { cartItemIds } });
    });

  const handleDelete = () =>
    run(async () => {
      if (!window.confirm('Yakin mau hapus kategori ini beserta isinya?'))
        return;
      await deletePlan(planId);
      onBack();
    });

  /* ── Loading state ── */
  if (loading) {
    return (
      <Shell>
        <div className="space-y-4">
          <div className="h-4 w-32 animate-pulse rounded-full bg-[#E8ECF4]" />
          <div className="h-8 w-64 animate-pulse rounded-full bg-[#E8ECF4]" />
          <div className="h-6 w-40 animate-pulse rounded-full bg-[#E8ECF4]" />
          <div className="mt-6 h-80 animate-pulse rounded-[24px] bg-white/95" />
        </div>
      </Shell>
    );
  }

  /* ── Error state ── */
  if (error || !plan) {
    return (
      <Shell>
        <div className="py-20 text-center">
          <div
            className="
              mx-auto flex h-14 w-14 items-center justify-center
              rounded-full bg-[#FFF0F0]
            "
          >
            <Icon name="alert" size={22} className="text-[#FF4646]" />
          </div>
          <p className="mt-4 text-[14px] font-semibold text-[#C73535]">
            {error ?? 'Kategorinya nggak ketemu'}
          </p>
          <button
            type="button"
            onClick={onBack}
            className="
              mt-4 inline-flex items-center gap-1.5 rounded-full
              bg-[#538CDB] px-4 py-2 text-[12px] font-semibold text-white
              shadow-[0_6px_16px_rgba(83,140,219,0.25)] transition-all
              hover:bg-[#467BC7]
            "
          >
            <Icon name="arrowLeft" size={13} />
            Kembali ke daftar
          </button>
        </div>
      </Shell>
    );
  }

  const budgetNum = parseFloat(plan.budget);
  const totalNum = parseFloat(plan.total);
  const overBudget = budgetNum > 0 && totalNum > budgetNum;
  const pct =
    budgetNum > 0 ? Math.min(100, Math.round((totalNum / budgetNum) * 100)) : 0;

  return (
    <div
      className="min-h-screen flex flex-col bg-[#F5F5FF]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-8 sm:px-8">
        {/* Back button */}
        <button
          type="button"
          onClick={onBack}
          className="
            mb-4 inline-flex items-center gap-1.5 rounded-full bg-white
            px-3.5 py-1.5 text-[12px] font-semibold text-[#737A87]
            shadow-sm transition-all duration-200 hover:text-[#538CDB]
            hover:shadow-[0_4px_12px_rgba(83,140,219,0.12)]
          "
        >
          <Icon name="arrowLeft" size={13} />
          Kembali
        </button>

        {/* ── Header card — design sama dengan NeedPayPage ──
            Panel kiri: gambar besar dengan gelombang putih pemisah
            Panel kanan: info plan + tombol aksi */}
        <figure
          className="
            overflow-hidden rounded-[24px] border border-white/80
            bg-white/95 shadow-[0_18px_50px_rgba(32,36,45,0.10)]
            backdrop-blur-sm
          "
        >
          {/* Mobile: gambar banner di atas */}
          <div className="relative h-40 md:hidden">
            <img
              src={needpayCard}
              alt=""
              draggable={false}
              className="absolute inset-0 h-full w-full select-none object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#20242D]/55 via-transparent to-transparent" />
            <div
              className="
                absolute left-4 top-4 inline-flex items-center gap-1.5
                rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold
                uppercase tracking-[0.18em] text-[#538CDB] backdrop-blur-sm
              "
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
              Rencana Belanja
            </div>
          </div>

          <div className="grid md:grid-cols-[0.9fr_1.1fr]">
            {/* Panel kiri: gambar besar (desktop only) */}
            <section className="relative hidden min-h-[360px] overflow-hidden md:block">
              <img
                src={needpayCard}
                alt=""
                draggable={false}
                className="
                  absolute inset-0 h-full w-full select-none object-cover
                  transition-transform duration-700 hover:scale-[1.03]
                "
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#20242D]/55 via-transparent to-transparent" />

              {/* Gelombang putih pemisah (signature NeedBuy) */}
              <svg
                className="
                  pointer-events-none absolute inset-y-0 right-0 h-full
                  w-16 md:w-20
                "
                viewBox="0 0 100 400"
                preserveAspectRatio="none"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M100 0 C 40 40, 90 90, 55 140 C 20 190, 70 230, 90 280 C 105 320, 50 360, 100 400 L 130 400 L 130 0 Z"
                  fill="white"
                />
              </svg>

              {/* Label pill */}
              <div
                className="
                  absolute left-6 top-6 z-10 inline-flex items-center
                  gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[10px]
                  font-semibold uppercase tracking-[0.18em] text-[#538CDB]
                  backdrop-blur-sm
                "
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
                Rencana Belanja
              </div>

              {/* Dekorasi titik kuning */}
              <div/>

              {/* Info ringkas di bawah gambar */}
              <div className="absolute bottom-5 left-6 z-10 text-white">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
                  Belanja Terarah
                </p>
                <p className="mt-0.5 font-mono text-[11px] text-white/90">
                  {plan.items.length} produk siap di-checkout
                </p>
              </div>
            </section>

            {/* Panel kanan: konten plan */}
            <section className="flex items-center bg-white px-6 py-7 sm:px-8 lg:px-10">
              <div className="mx-auto w-full max-w-lg">
                {/* Mobile label */}
                <div className="mb-4 md:hidden">
                  <p
                    className="
                      text-[10px] font-semibold uppercase tracking-[0.18em]
                      text-[#538CDB]
                    "
                  >
                    Rencana Belanja
                  </p>
                </div>

                <h1
                  className="
                    text-[22px] font-extrabold leading-tight
                    tracking-tight text-[#20242D] sm:text-[28px]
                  "
                >
                  {planTitle(plan)}
                </h1>

                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[12px] text-[#737A87]">
                  <span className="font-semibold text-[#20242D]">
                    {plan.items.length} produk
                  </span>
                  {budgetNum > 0 && (
                    <>
                      <span className="h-1 w-1 rounded-full bg-[#D8DEE9]" />
                      <span>Anggaran {formatRupiah(budgetNum)}</span>
                    </>
                  )}
                </div>

                {/* Budget progress */}
                {budgetNum > 0 && (
                  <div className="mt-5">
                    <div className="h-2 overflow-hidden rounded-full bg-[#F5F7FB]">
                      <div
                        className={`
                          h-full rounded-full transition-all duration-700
                          ${overBudget ? 'bg-[#FF4646]' : 'bg-[#538CDB]'}
                        `}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div
                      className="
                        mt-1.5 flex items-center justify-between text-[11px]
                      "
                    >
                      <span
                        className={`
                          font-semibold
                          ${overBudget ? 'text-[#FF4646]' : 'text-[#538CDB]'}
                        `}
                      >
                        {formatRupiah(totalNum)} terpakai
                      </span>
                      <span className="text-[#A2A8B3]">
                        Sisa {formatRupiah(Math.max(0, budgetNum - totalNum))}
                      </span>
                    </div>
                  </div>
                )}

                {/* Tombol aksi */}
                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEdit(true)}
                    className="
                      flex h-10 items-center gap-1.5 rounded-full border
                      border-[#E8ECF4] bg-white px-4 text-[12px]
                      font-semibold text-[#20242D] transition-all
                      duration-200 hover:border-[#538CDB]
                      hover:text-[#538CDB]
                    "
                  >
                    <Icon name="edit" size={13} />
                    Ubah
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAdd(true)}
                    className="
                      flex h-10 items-center gap-1.5 rounded-full
                      bg-[#538CDB] px-4 text-[12px] font-semibold
                      text-white shadow-[0_6px_16px_rgba(83,140,219,0.25)]
                      transition-all duration-200 hover:bg-[#467BC7]
                      hover:shadow-[0_8px_20px_rgba(83,140,219,0.30)]
                      active:scale-[0.99]
                    "
                  >
                    <Icon name="plus" size={13} />
                    Tambah Produk
                  </button>
                </div>
              </div>
            </section>
          </div>
        </figure>

        {/* Error / Warning */}
        {actionError && (
          <div
            className="
              mt-4 flex items-center gap-2 rounded-2xl border
              border-[#FF4646]/20 bg-[#FFF0F0] px-4 py-3 backdrop-blur-sm
            "
          >
            <Icon name="alert" size={15} className="shrink-0 text-[#FF4646]" />
            <p className="text-[13px] font-medium text-[#C73535]">
              {actionError}
            </p>
          </div>
        )}

        {overBudget && (
          <div
            className="
              mt-4 flex items-center gap-2 rounded-2xl border
              border-[#FFD500]/30 bg-[#FFF7E0] px-4 py-3 backdrop-blur-sm
            "
          >
            <Icon name="alert" size={15} className="shrink-0 text-[#B45309]" />
            <p className="text-[13px] font-medium text-[#B45309]">
              Lewat anggaran{' '}
              <span className="font-bold">
                {formatRupiah(totalNum - budgetNum)}
              </span>
              . Pertimbangkan hapus beberapa item.
            </p>
          </div>
        )}

        {/* ── Items card ── */}
        <div
          className="
            mt-6 overflow-hidden rounded-[24px] border border-white/80
            bg-white/95 px-5 py-2 shadow-[0_18px_50px_rgba(32,36,45,0.08)]
            backdrop-blur-sm
          "
        >
          {plan.items.length === 0 ? (
  /* ── Empty state: background Kosong.jpg + card putih floating di kiri ── */
  <div
    className="
      relative my-2 min-h-[340px] overflow-hidden rounded-2xl
      bg-cover bg-center sm:min-h-[400px]
    "
    style={{ backgroundImage: `url(${kosongImg})` }}
  >
    <div
      className="
        relative flex min-h-[340px] items-center px-4 py-8
        sm:min-h-[400px] sm:px-8 sm:py-10
      "
    >
      {/* ── Card putih — design sama dengan card lain di app ── */}
      <div
        className="
          relative w-full max-w-md overflow-hidden rounded-[24px]
          border border-white/80 bg-white/95 p-6
          shadow-[0_18px_50px_rgba(32,36,45,0.12)] backdrop-blur-sm
          sm:p-7
        "
      >
        {/* Dekorasi khas card NeedBuy */}
        <span
          className="
            pointer-events-none absolute -right-8 -top-8 h-20 w-20
            rounded-full border border-[#538CDB]/10
          "
        />
        <span
          className="
            pointer-events-none absolute right-6 top-6 h-1.5 w-1.5
            rounded-full bg-[#FFD500]
          "
        />

        {/* Eyebrow pill */}
        <span
          className="
            inline-flex items-center gap-1.5 rounded-full
            bg-[#538CDB]/10 px-2.5 py-1
          "
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
          <p
            className="
              text-[9px] font-bold uppercase tracking-[0.20em]
              text-[#538CDB]
            "
          >
            Belum ada produk
          </p>
        </span>

        {/* Judul */}
        <h3
          className="
            mt-3 text-[20px] font-extrabold leading-tight tracking-tight
            text-[#20242D] sm:text-[24px]
          "
        >
          Kategori ini masih kosong
        </h3>

        {/* Deskripsi */}
        <p className="mt-2 text-[13px] leading-relaxed text-[#737A87]">
          Yuk, mulai belanja terarah. Tambahkan produk-produk pilihanmu
          ke kategori ini dan checkout semuanya sekaligus tanpa ribet.
        </p>

        {/* CTA */}
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="
            mt-5 inline-flex items-center gap-1.5 rounded-full
            bg-[#538CDB] px-5 py-2.5 text-[12px] font-semibold
            text-white shadow-[0_7px_18px_rgba(83,140,219,0.25)]
            transition-all duration-200 hover:bg-[#467BC7]
            hover:shadow-[0_9px_22px_rgba(83,140,219,0.30)]
            active:scale-[0.99]
          "
        >
          <Icon name="plus" size={13} />
          Tambah Produk Pertama
        </button>

        {/* Stats mini — dipisah border halus */}
        <div
          className="
            mt-6 flex items-center gap-4 border-t border-[#F5F7FB]
            pt-4 text-[11px] text-[#A2A8B3]
          "
        >
          <span className="inline-flex items-center gap-1">
            <Icon name="cart" size={11} />0 produk
          </span>
          <span className="h-1 w-1 rounded-full bg-[#D8DEE9]" />
          <span className="inline-flex items-center gap-1">
            <Icon name="card" size={11} />
            Total {formatRupiah(0)}
          </span>
        </div>
      </div>
    </div>
  </div>
) : (
            <>
              {/* Header items list */}
              <div
                className="
                  mb-2 flex items-center justify-between border-b
                  border-[#E8ECF4] py-3
                "
              >
                <div className="flex items-center gap-2">
                  <span
                    className="
                      flex h-7 w-7 items-center justify-center rounded-lg
                      bg-[#538CDB]/10
                    "
                  >
                    <Icon name="grid" size={13} className="text-[#538CDB]" />
                  </span>
                  <p className="text-[12px] font-bold text-[#20242D]">
                    Daftar Produk
                  </p>
                </div>
                <span className="text-[11px] text-[#A2A8B3]">
                  {plan.items.length} item
                </span>
              </div>

              {plan.items.map((item) => (
                <PlanItemRow
                  key={item.id}
                  item={item}
                  disabled={busy}
                  onQty={(quantity) =>
                    run(async () => {
                      await updatePlanItem(planId, item.id, quantity);
                      await refetch();
                    })
                  }
                  onRemove={() =>
                    run(async () => {
                      await removePlanItem(planId, item.id);
                      await refetch();
                    })
                  }
                />
              ))}
            </>
          )}
        </div>
      </main>

      {/* Sticky footer */}
      <div
        className="
          sticky bottom-0 z-30 border-t border-[#E8ECF4] bg-white/95
          backdrop-blur-md
        "
      >
        <div
          className="
            mx-auto flex max-w-4xl flex-wrap items-center justify-between
            gap-3 px-4 py-4 sm:px-8
          "
        >
          <div>
            <p
              className="
                text-[10px] font-semibold uppercase tracking-[0.18em]
                text-[#737A87]
              "
            >
              Total kategori
            </p>
            <p
              className={`
                text-[20px] font-extrabold tracking-tight
                ${overBudget ? 'text-[#FF4646]' : 'text-[#20242D]'}
              `}
            >
              {formatRupiah(totalNum)}
            </p>
          </div>

          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={handleDelete}
              disabled={busy}
              className="
                flex h-11 items-center gap-1.5 rounded-full border
                border-[#FF4646]/30 bg-white px-4 text-[13px] font-semibold
                text-[#C73535] transition-all duration-200
                hover:border-[#FF4646] hover:bg-[#FFF0F0]
                active:scale-[0.99] disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <Icon name="trash" size={14} />
              Hapus
            </button>
            <button
              type="button"
              onClick={handleCheckoutAll}
              disabled={busy || plan.items.length === 0}
              className="
                flex h-11 items-center gap-2 rounded-full bg-[#538CDB]
                px-6 text-[13px] font-semibold text-white
                shadow-[0_7px_18px_rgba(83,140,219,0.25)] transition-all
                duration-200 hover:bg-[#467BC7]
                hover:shadow-[0_9px_22px_rgba(83,140,219,0.30)]
                active:scale-[0.99] disabled:cursor-not-allowed
                disabled:bg-[#A2A8B3] disabled:shadow-none
              "
            >
              {busy ? (
                <Icon name="clock" size={15} className="animate-spin" />
              ) : (
                <Icon name="cart" size={15} />
              )}
              Checkout Semua ({plan.items.length})
            </button>
          </div>
        </div>
      </div>

      {showAdd && (
        <AddProductModal
          planId={planId}
          onClose={() => setShowAdd(false)}
          onAdded={refetch}
        />
      )}
      {showEdit && (
        <CategoryModal
          planId={planId}
          initial={{
            name: plan.name ?? '',
            budget: budgetNum > 0 ? String(budgetNum) : '',
          }}
          onClose={() => setShowEdit(false)}
          onSaved={() => {
            setShowEdit(false);
            refetch();
          }}
        />
      )}

      <Footer />
    </div>
  );
};

/* ── Shell wrapper untuk state loading/error ── */
const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    className="min-h-screen flex flex-col bg-[#F5F5FF]"
    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
  >
    <Navbar />
    <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-8 sm:px-8">
      {children}
    </main>
    <Footer />
  </div>
);

export default PlanDetail;