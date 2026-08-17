import React, { useState } from 'react';

import Icon from '../ui/Icon';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';

import PlanCard from './PlanCard';
import CategoryModal from './CategoryModal';
import PlansLoginPrompt from './PlansLoginPrompt';
import PlansEmptyState from './PlansEmptyState';

import { useShoppingPlans } from '../../hooks/useShoppingPlans';
import { getAccessToken } from '../../api/auth';

interface PlansListViewProps {
  onSelect: (planId: string) => void;
}

const PlansListView: React.FC<PlansListViewProps> = ({ onSelect }) => {
  const { plans, loading, error, refetch } = useShoppingPlans();
  const [showCreate, setShowCreate] = useState(false);
  const isAuthed = !!getAccessToken();

  /* ── Belum login → card login bergambar ── */
  if (!isAuthed) {
    return <PlansLoginPrompt />;
  }

  /* ── Loading skeleton ── */
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
      </div>

      {/* ── ERROR → card Waduh.png (ganti banner merah polos) ── */}
      {error ? (
        <div className="mt-8">
          <PlansEmptyState
            variant="error"
            errorMessage={error}
            onRetry={refetch}
          />
        </div>
      ) : plans.length === 0 ? (
        /* ── EMPTY → card Ayo.png (ganti dashed lama) ── */
        <div className="mt-8">
          <PlansEmptyState
            variant="empty"
            onCreate={() => setShowCreate(true)}
          />
        </div>
      ) : (
        /* ── Grid kategori ── */
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

      {/* Modal buat kategori */}
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