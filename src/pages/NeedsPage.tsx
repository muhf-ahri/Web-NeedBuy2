// src/pages/NeedsPage.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/ui/Icon';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { formatRupiah } from '../utils/currency';
import {
  getNeeds, createNeed, processNeed, getRecommendations,
  confirmNeed, type Need, type Recommendation, type ClarificationItem,
} from '../api/needs';
import { getAccessToken } from '../api/auth';
import { useCart as useCartContext } from '../contexts/CartContext';
import { addToCart } from '../api/cart';
import { createPlan } from '../api/plans';

const LABEL_STYLE: Record<Recommendation['label'], { label: string; cls: string }> = {
  BEST_MATCH: { label: 'Paling Cocok', cls: 'bg-[#004ac6] text-white' },
  GOOD_MATCH: { label: 'Cocok', cls: 'bg-[#dbe1ff] text-[#004ac6]' },
  ALTERNATIVE: { label: 'Alternatif', cls: 'bg-[#f2f4f6] text-[#434655]' },
};

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
  const [parsed, setParsed] = useState<{ need: Need; needsClarification: boolean; clarificationQuestions: ClarificationItem[] } | null>(null);

  // Recommendations view
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
      // Konfirmasi saja tidak menghasilkan apa pun — rekomendasi baru ada
      // setelah pipeline matching dijalankan.
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

  // Tanpa categoryId, server menurunkan kategori dari kalimat user sendiri.
  // Versi sebelumnya mengirim kategori root PERTAMA apa pun yang dicari user —
  // "olahraga" pun diproses sebagai "Elektronik", jadi hasilnya selalu kosong.
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

  // Alur lama halaman Rencana Belanja: rekomendasi AI dirangkum jadi satu
  // rencana. Sekarang tinggal di sini, karena /plans dipakai untuk grup belanja
  // yang disusun sendiri oleh user.
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

  if (!isAuthed) {
    return (
      <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Navbar />
        <main className="flex-1 max-w-6xl mx-auto w-full px-5 sm:px-10 py-16 flex items-center justify-center">
          <div className="text-center">
            <Icon name="lock" size={48} className="text-[#c3c6d7] mx-auto mb-4" />
            <p className="text-[#737686] mb-4">Login dulu ya buat nulis kebutuhan belanjamu.</p>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2.5 rounded-full bg-[#004ac6] text-white text-[14px] font-semibold"
            >
              Login
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-5 sm:px-10 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="text-[28px] font-bold text-[#191c1e]">Kebutuhan Saya</h1>
          <button
            onClick={() => setShowCreate((s) => !s)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#004ac6] hover:bg-[#003ea8] text-white text-[13px] font-semibold transition-colors"
          >
            {showCreate ? <Icon name="close" size={16} className="" /> : <Icon name="plus" size={16} className="" />}
            {showCreate ? 'Tutup' : 'Tulis Kebutuhan'}
          </button>
        </div>

        {error && (
          <div className="bg-[#ffdad6] border border-[#ba1a1a]/20 rounded-2xl px-4 py-3 mb-4">
            <p className="text-[13px] text-[#93000a]">{error}</p>
          </div>
        )}

        {/* ── Create need ── */}
        {showCreate && (
          <div className="bg-[#f2f6ff] border border-[#dbe1ff] rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="spark" size={20} className="text-[#004ac6]" />
              <h3 className="text-[16px] font-bold text-[#191c1e]">Ceritain Kebutuhanmu</h3>
            </div>
            <p className="text-[13px] text-[#737686] mb-4">
              Contoh: "Saya butuh laptop untuk editing video budget 15 juta, ram minimal 16GB."
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreate();
              }}
            >
              <textarea
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleCreate();
                  }
                }}
                rows={3}
                placeholder="Ceritain kebutuhanmu... (tekan Enter buat dianalisis)"
                className="w-full px-4 py-3 bg-white rounded-xl border border-[#dbe1ff] outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20 text-sm resize-none transition"
              />
              <div className="mt-3 flex gap-3">
                <button
                  type="submit"
                  disabled={creating || !rawInput.trim()}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#004ac6] hover:bg-[#003ea8] text-white text-[13px] font-semibold transition-colors disabled:opacity-50"
                >
                  {creating && <Icon name="clock" size={16} className="animate-spin" />}
                  Analisis Kebutuhan
                </button>
              </div>
            </form>

            {/* Parsed result */}
            {parsed && (
              <div className="mt-4 bg-white rounded-xl border border-[#e0e3e5] p-4">
                <p className="text-[13px] font-bold text-[#191c1e] mb-2">Hasil Analisis</p>
                <p className="text-[12px] text-[#737686]">
                  Kebutuhan: <span className="text-[#191c1e]">{parsed.need.goal ?? '—'}</span>
                </p>
                <p className="text-[12px] text-[#737686]">
                  Budget: <span className="text-[#191c1e]">{parsed.need.budget ? formatRupiah(parsed.need.budget) : '—'}</span>
                </p>
                <p className="text-[12px] text-[#737686]">
                  Lokasi: <span className="text-[#191c1e]">{parsed.need.location ?? '—'}</span>
                </p>

                {parsed.needsClarification && (
                  <div className="mt-3 bg-[#fff4e0] rounded-lg px-3 py-2">
                    <p className="text-[12px] font-semibold text-[#7c3e00] mb-1">
                      Informasi masih kurang, mohon lengkapi:
                    </p>
                    {parsed.clarificationQuestions.map((q, i) => (
                      <p key={i} className="text-[12px] text-[#7c3e00]">
                        • {q.question}
                        {q.context ? ` (${q.context})` : ''}
                      </p>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleConfirm(parsed.need.id)}
                    disabled={busy === 'confirm'}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#191c1e] hover:bg-[#004ac6] text-white text-[12px] font-semibold transition-colors disabled:opacity-50"
                  >
                    {busy === 'confirm' && <Icon name="clock" size={14} className="animate-spin" />}
                    Konfirmasi & Cari
                  </button>
                  <button
                    onClick={() => handleProcess(parsed.need.id)}
                    disabled={busy === 'process'}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#004ac6] text-[#004ac6] text-[12px] font-semibold hover:bg-[#dbe1ff]/40 transition-colors disabled:opacity-50"
                  >
                    {busy === 'process' && <Icon name="clock" size={14} className="animate-spin" />}
                    Cari Sekarang
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── List of needs ── */}
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-24 bg-[#f2f4f6] rounded-2xl" />
            <div className="h-24 bg-[#f2f4f6] rounded-2xl" />
          </div>
        ) : needs.length === 0 && !showCreate ? (
          <div className="text-center py-20">
            <Icon name="spark" size={48} className="text-[#c3c6d7] mx-auto mb-4" />
            <p className="text-[#737686]">Belum ada kebutuhan yang ditulis.</p>
            <p className="text-[12px] text-[#c3c6d7] mt-1">Tulis kebutuhanmu, nanti kami cariin produk yang paling pas.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {needs.map((need) => (
              <div key={need.id} className="bg-white border border-[#e0e3e5] rounded-2xl p-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold text-[#191c1e] line-clamp-1">{need.rawInput}</p>
                    <p className="text-[12px] text-[#737686] mt-0.5">
                      {need.goal ?? 'Belum dianalisis'}
                      {need.budget ? ` · Budget ${formatRupiah(need.budget)}` : ''}
                      {need.location ? ` · ${need.location}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#f2f4f6] text-[#434655]">
                      {need.status}
                    </span>
                    <button
                      onClick={() => openRecommendations(need.id)}
                      disabled={need.status === 'DRAFT'}
                      className="px-4 py-1.5 rounded-full bg-[#004ac6] hover:bg-[#003ea8] text-white text-[12px] font-semibold transition-colors disabled:opacity-40"
                    >
                      Lihat Rekomendasi
                    </button>
                    <button
                      onClick={() => handleMakePlan(need)}
                      disabled={need.status === 'DRAFT' || busy === `plan-${need.id}`}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#004ac6] text-[#004ac6] text-[12px] font-semibold hover:bg-[#dbe1ff]/40 transition-colors disabled:opacity-40"
                    >
                      {busy === `plan-${need.id}` ? <Icon name="clock" size={12} className="animate-spin" /> : <Icon name="spark" size={12} className="" />}
                      Jadikan Rencana
                    </button>
                  </div>
                </div>

                {/* Recommendations */}
                {activeNeedId === need.id && (
                  <div className="mt-4 border-t border-[#e0e3e5] pt-4">
                    {recLoading ? (
                      <div className="animate-pulse space-y-2">
                        <div className="h-16 bg-[#f2f4f6] rounded-xl" />
                        <div className="h-16 bg-[#f2f4f6] rounded-xl" />
                      </div>
                    ) : recs.length === 0 ? (
                      <p className="text-[12px] text-[#737686] text-center py-4">
                        Belum ada rekomendasi. Proses dulu kebutuhan ini ya.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {recs.map((rec) => (
                          <div
                            key={rec.id}
                            onClick={() => navigate(`/products/${rec.product.slug}`)}
                            className="flex items-center gap-3 bg-[#f8f9fb] rounded-xl p-3 cursor-pointer hover:border hover:border-[#004ac6] transition-colors"
                          >
                            <div className="w-12 h-12 rounded-lg bg-white overflow-hidden shrink-0">
                              <img
                                src={rec.product.images.find((i) => i.isPrimary)?.url || rec.product.images[0]?.url || ''}
                                alt={rec.product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold mb-1 ${LABEL_STYLE[rec.label].cls}`}>
                                {LABEL_STYLE[rec.label].label} · #{rec.ranking}
                              </span>
                              <p className="text-[13px] font-semibold text-[#191c1e] truncate">{rec.product.name}</p>
                              <div className="flex items-center gap-1 text-[11px] text-[#737686]">
                                <Icon name="star" size={12} className="text-[#ffb020] " />
                                {rec.product.rating} · Skor {rec.matchScore}%
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-[14px] font-bold text-[#004ac6]">{formatRupiah(rec.product.price)}</p>
                              <button
                                onClick={(e) => handleAddToCart(e, rec.product.id)}
                                disabled={busy === rec.product.id}
                                className="mt-1 flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#191c1e] hover:bg-[#004ac6] text-white text-[11px] font-semibold transition-colors disabled:opacity-50"
                              >
                                {busy === rec.product.id ? <Icon name="clock" size={12} className="animate-spin" /> : <Icon name="cart" size={12} className="" />}
                                Keranjang
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default NeedsPage;
