import React, { useState } from 'react';

import Icon from '../ui/Icon';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';

import PlanCard from './PlanCard';
import CategoryModal from './CategoryModal';
import PlansLoginPrompt from './PlansLoginPrompt';

import { useShoppingPlans } from '../../hooks/useShoppingPlans';
import { getAccessToken } from '../../api/auth';

interface PlansListViewProps {
  onSelect: (planId: string) => void;
}

const PlansListView: React.FC<PlansListViewProps> = ({ onSelect }) => {
  const { plans, loading, error, refetch } = useShoppingPlans();
  const [showCreate, setShowCreate] = useState(false);
  const isAuthed = !!getAccessToken();

  /* ── BELUM LOGIN → langsung tampilkan card login,
        list view tidak di-render sama sekali ── */
  if (!isAuthed) {
    return <PlansLoginPrompt />;
  }

  /* ── Loading skeleton (hanya untuk user login) ── */
  if (loading) {
    return (
      <Shell>
        <HeaderSkeleton />
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-56 animate-pulse rounded-[24px] bg-white/95"
            />
          ))}
        </div>
      </Shell>
    );
  }

  /* ── SUDAH LOGIN → list view normal ── */
  return (
    <Shell>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
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
                Belanja terarah
              </p>
            </span>
          </div>

          <h1
            className="
              text-[26px] font-extrabold leading-tight tracking-tight
              text-[#20242D] sm:text-[32px]
            "
          >
            Rencana Belanja
          </h1>
          <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-[#737A87]">
            Kelompokkan belanjaanmu per kategori — mis. "Kamar" isi kipas &
            lampu — terus checkout sekaligus tanpa centang satu-satu.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="
            flex h-11 shrink-0 items-center gap-2 rounded-full
            bg-[#538CDB] px-5 text-[13px] font-semibold text-white
            shadow-[0_7px_18px_rgba(83,140,219,0.25)] transition-all
            duration-200 hover:bg-[#467BC7]
            hover:shadow-[0_9px_22px_rgba(83,140,219,0.30)]
            active:scale-[0.99]
          "
        >
          <Icon name="plus" size={15} />
          Buat Kategori
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          className="
            mt-6 flex items-center gap-2 rounded-2xl border
            border-[#FF4646]/20 bg-[#FFF0F0] px-4 py-3 backdrop-blur-sm
          "
        >
          <Icon name="alert" size={15} className="shrink-0 text-[#FF4646]" />
          <p className="text-[13px] font-medium text-[#C73535]">{error}</p>
        </div>
      )}

      {/* Empty / Grid */}
      {plans.length === 0 ? (
        <div
          className="
            mt-8 rounded-[24px] border border-dashed border-[#D8DEE9]
            bg-white/70 py-16 text-center backdrop-blur-sm
          "
        >
          <div
            className="
              mx-auto flex h-16 w-16 items-center justify-center
              rounded-full bg-gradient-to-br from-[#5B93E0] to-[#3A66AC]
              shadow-[0_8px_20px_rgba(83,140,219,0.30)]
            "
          >
            <Icon name="grid" size={24} className="text-white" />
          </div>
          <p className="mt-4 text-[16px] font-bold text-[#20242D]">
            Belum ada rencana belanja
          </p>
          <p className="mx-auto mt-1 max-w-sm text-[13px] text-[#737A87]">
            Bikin kategori pertamamu supaya belanja lebih terarah dan hemat
            waktu.
          </p>
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="
              mt-5 inline-flex items-center gap-2 rounded-full bg-[#538CDB]
              px-5 py-2.5 text-[13px] font-semibold text-white
              shadow-[0_7px_18px_rgba(83,140,219,0.25)] transition-all
              hover:bg-[#467BC7]
              hover:shadow-[0_9px_22px_rgba(83,140,219,0.30)]
              active:scale-[0.99]
            "
          >
            <Icon name="plus" size={14} />
            Buat Kategori Pertama
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onClick={() => onSelect(plan.id)}
            />
          ))}
        </div>
      )}

      {/* Modal buat kategori — hanya muncul saat sudah login */}
      {showCreate && (
        <CategoryModal
          onClose={() => setShowCreate(false)}
          onSaved={(planId) => {
            setShowCreate(false);
            refetch();
            onSelect(planId);
          }}
        />
      )}
    </Shell>
  );
};

/* ── Shell wrapper ── */
const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    className="min-h-screen flex flex-col bg-[#F5F5FF]"
    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
  >
    <Navbar />
    <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-8 sm:px-8">
      {children}
    </main>
    <Footer />
  </div>
);

/* ── Skeleton header ── */
const HeaderSkeleton: React.FC = () => (
  <div className="space-y-3">
    <div className="h-5 w-32 animate-pulse rounded-full bg-[#E8ECF4]" />
    <div className="h-8 w-64 animate-pulse rounded-full bg-[#E8ECF4]" />
    <div className="h-3 w-96 max-w-full animate-pulse rounded-full bg-[#E8ECF4]" />
  </div>
);

export default PlansListView;