import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Icon from '../components/ui/Icon';
import NeedsShell from '../components/needs/NeedsShell';
import NeedsHero from '../components/needs/NeedsHero';
import NeedsCreateForm from '../components/needs/NeedsCreateForm';
import NeedCard from '../components/needs/NeedCard';
import NeedsEmptyState from '../components/needs/NeedsEmptyState';
import NeedsLoginPrompt from '../components/needs/NeedsLoginPrompt';

import {
  getNeeds,
  createNeed,
  processNeed,
  getRecommendations,
  confirmNeed,
  type Need,
  type Recommendation,
  type ClarificationItem,
} from '../api/needs';
import { getAccessToken } from '../api/auth';
import { useCart as useCartContext } from '../contexts/CartContext';
import { addToCart } from '../api/cart';
import { createPlan } from '../api/plans';

const NeedsPage: React.FC = () => {
  const navigate = useNavigate();
  const { refreshCartCount } = useCartContext();

  const [needs, setNeeds] = useState<Need[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create need flow
  const [showCreate, setShowCreate] = useState(false);
  const [rawInput, setRawInput] = useState('');
  const [creating, setCreating] = useState(false);
  const [parsed, setParsed] = useState<{
    need: Need;
    needsClarification: boolean;
    clarificationQuestions: ClarificationItem[];
  } | null>(null);

  // Recommendations
  const [activeNeedId, setActiveNeedId] = useState<string | null>(null);
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [recLoading, setRecLoading] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  const isAuthed = !!getAccessToken();

  const fetchNeeds = useCallback(async () => {
    if (!isAuthed) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data } = await getNeeds({ limit: 50 });
      setNeeds(data);
    } catch (err: any) {
      setError(err.message ?? 'Gagal muat kebutuhan, coba lagi ya');
    } finally {
      setLoading(false);
    }
  }, [isAuthed]);

  useEffect(() => {
    fetchNeeds();
  }, [fetchNeeds]);

  const handleCreate = async () => {
    if (!rawInput.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const res = await createNeed(rawInput.trim());
      setParsed(res.data.data);
      setRawInput('');
      await fetchNeeds();
      if (!res.data.data.needsClarification) {
        setShowCreate(false);
        setParsed(null);
      }
    } catch (err: any) {
      setError(err.message ?? 'Gagal simpan kebutuhan, coba lagi ya');
    } finally {
      setCreating(false);
    }
  };

  const handleConfirm = async (needId: string) => {
    setBusy('confirm');
    setError(null);
    try {
      await confirmNeed(needId, {});
      await processNeed(needId);
      await fetchNeeds();
      setShowCreate(false);
      setParsed(null);
      await openRecommendations(needId);
    } catch (err: any) {
      setError(err.message ?? 'Gagal konfirmasi kebutuhan, coba lagi ya');
    } finally {
      setBusy(null);
    }
  };

  const handleProcess = async (needId: string) => {
    setBusy('process');
    setError(null);
    try {
      await processNeed(needId);
      await fetchNeeds();
      await openRecommendations(needId);
    } catch (err: any) {
      setError(err.message ?? 'Gagal proses kebutuhan, coba lagi ya');
    } finally {
      setBusy(null);
    }
  };

  const openRecommendations = async (needId: string) => {
    setActiveNeedId((prev) => (prev === needId ? null : needId));
    setRecLoading(true);
    setError(null);
    try {
      const { data } = await getRecommendations(needId, 1, 50);
      setRecs(data);
    } catch (err: any) {
      setError(err.message ?? 'Gagal muat rekomendasi, coba lagi ya');
    } finally {
      setRecLoading(false);
    }
  };

  const handleMakePlan = async (need: Need) => {
    setBusy(`plan-${need.id}`);
    setError(null);
    try {
      const res = await createPlan({
        name: need.goal ?? need.rawInput.slice(0, 60),
        budget: Number(need.budget) || 0,
        needId: need.id,
        fromRecommendations: true,
        maxItems: 5,
      });
      navigate('/plans', { state: { planId: res.data.data.id } });
    } catch (err: any) {
      setError(err.message ?? 'Gagal bikin rencana belanja, coba lagi ya');
    } finally {
      setBusy(null);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    if (!isAuthed) {
      navigate('/login');
      return;
    }
    setBusy(productId);
    setError(null);
    try {
      await addToCart(productId, 1);
      await refreshCartCount();
    } catch (err: any) {
      setError(err.message ?? 'Gagal masukin ke keranjang, coba lagi ya');
    } finally {
      setBusy(null);
    }
  };

  /* ── Belum login ── */
  if (!isAuthed) {
    return <NeedsLoginPrompt />;
  }

  return (
    <NeedsShell>
      <NeedsHero
        showCreate={showCreate}
        onToggle={() => setShowCreate((s) => !s)}
      />

      {/* Error global */}
      {error && (
        <div
          className="
            mb-5 flex items-center gap-3 rounded-2xl border
            border-[#FF4646]/20 bg-[#FFF0F0] px-4 py-3 backdrop-blur-sm
          "
        >
          <span
            className="
              flex h-8 w-8 shrink-0 items-center justify-center rounded-full
              bg-[#FF4646]/15
            "
          >
            <Icon name="alert" size={15} className="text-[#FF4646]" />
          </span>
          <p className="text-[13px] font-medium text-[#C73535]">{error}</p>
        </div>
      )}

      {/* Create form */}
      {showCreate && (
        <NeedsCreateForm
          rawInput={rawInput}
          onRawInputChange={setRawInput}
          onSubmit={handleCreate}
          onConfirm={handleConfirm}
          onProcess={handleProcess}
          creating={creating}
          busyType={busy}
          parsed={parsed}
        />
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="
                h-32 animate-pulse rounded-[24px] border border-white/80
                bg-white/95
              "
            />
          ))}
        </div>
      ) : needs.length === 0 && !showCreate ? (
        <NeedsEmptyState onWrite={() => setShowCreate(true)} />
      ) : (
        <div className="space-y-4">
          {needs.map((need) => (
            <NeedCard
              key={need.id}
              need={need}
              isActive={activeNeedId === need.id}
              recs={recs}
              recLoading={recLoading}
              busyId={busy}
              onOpenRecommendations={openRecommendations}
              onMakePlan={handleMakePlan}
              onOpenProduct={(slug) => navigate(`/products/${slug}`)}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </NeedsShell>
  );
};

export default NeedsPage;