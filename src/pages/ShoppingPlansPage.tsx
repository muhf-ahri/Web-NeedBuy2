// src/pages/ShoppingPlansPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon, { type IconName } from '../components/ui/Icon';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { formatRupiah } from '../utils/currency';
import { useShoppingPlans, useShoppingPlan } from '../hooks/useShoppingPlans';
import { createPlan, removePlanItem, addPlanToCart, deletePlan, type ShoppingPlan, type ShoppingPlanItem } from '../api/plans';
import { createNeed, confirmNeed, processNeed } from '../api/needs';
import { interpretWithAI, type NeedInterpretation } from '../api/ai';
import { getProductsByCategory, type GetProductsParams } from '../api/products';
import type { Product } from '../types';
import { getAccessToken } from '../api/auth';
import { useCart as useCartContext } from '../contexts/CartContext';

// ─── Pemetaan ikon produk ───────────────────────────────────────────────────────
const getProductIcon = (productName: string): IconName => {
  const lower = productName.toLowerCase();
  if (lower.includes('chair') || lower.includes('kursi') || lower.includes('meja') || lower.includes('desk')) return 'home';
  return 'grid';
};

// ─── Pemetaan status (bahasa Indonesia) ────────────────────────────────────────
const statusMap: Record<ShoppingPlan['status'], { label: string; color: string; bg: string }> = {
  DRAFT: { label: 'Draf', color: 'text-[#b45309]', bg: 'bg-[#fef3c7]' },
  READY: { label: 'Siap', color: 'text-[#15803d]', bg: 'bg-[#dcfce7]' },
  NEEDS_ADJUSTMENT: { label: 'Perlu Penyesuaian', color: 'text-[#ba1a1a]', bg: 'bg-[#ffdad6]' },
};

// ─── Kartu Kemajuan Anggaran ───────────────────────────────────────────────────
const BudgetCard: React.FC<{ plan: ShoppingPlan }> = ({ plan }) => {
  const budgetNum = parseFloat(plan.budget);
  const totalNum = parseFloat(plan.total);
  const remainingNum = parseFloat(plan.remaining);
  const pct = budgetNum > 0 ? Math.min(100, Math.round((totalNum / budgetNum) * 100)) : 0;

  return (
    <div className="bg-[#191c1e] rounded-2xl p-5 text-white">
      <p className="text-[10px] font-semibold text-[#9ea3b0] uppercase tracking-widest mb-1">
        Total Anggaran
      </p>
      <p className="text-[28px] font-bold leading-tight">{formatRupiah(budgetNum)}</p>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-[10px] text-[#9ea3b0] uppercase tracking-wider mb-0.5">Terpakai</p>
          <p className="text-[18px] font-semibold">{formatRupiah(totalNum)}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-[#9ea3b0] uppercase tracking-wider mb-0.5">Tersisa</p>
          <p className="text-[18px] font-semibold text-[#4ade80]">{formatRupiah(remainingNum)}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-1.5 bg-white/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-white rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-[11px] text-[#9ea3b0]">
        <span>{pct}% Terpakai</span>
        <span>{100 - pct}% Tersedia</span>
      </div>
    </div>
  );
};

// ─── Baris Item Rencana ────────────────────────────────────────────────────────
const PlanItemRow: React.FC<{
  item: ShoppingPlanItem;
  onRemove?: () => void;
  showActions?: boolean;
}> = ({ item, onRemove, showActions = true }) => {
  const iconName = getProductIcon(item.product.name);
  const subtotalNum = parseFloat(item.subtotal);

  return (
    <div className="flex items-center justify-between py-4 border-b border-[#e0e3e5] last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#eceef0] flex items-center justify-center shrink-0">
          <Icon name={iconName} size={18} className="text-[#434655]" />
        </div>
        <div>
          <p className="text-[14px] font-semibold text-[#191c1e] leading-tight">{item.product.name}</p>
          <p className="text-[12px] text-[#737686]">
            {item.product.category.name}{' '}
            <span className="text-[#434655]">• Jumlah: {item.quantity}</span>
            {item.isReplaced && <span className="text-[#b45309]"> • Diganti</span>}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4 shrink-0">
        <div className="text-right">
          <p className="text-[14px] font-bold text-[#191c1e]">
            {formatRupiah(subtotalNum)}
          </p>
          {showActions && onRemove && (
            <div className="flex gap-3 mt-0.5 justify-end">
              <button
                onClick={onRemove}
                className="text-[11px] text-[#ba1a1a] hover:underline flex items-center gap-0.5 transition-colors"
              >
                <Icon name="trash" size={12} className="" />
                Hapus
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Modal Buat Rencana (terintegrasi AI) ──────────────────────────────────────
const CreatePlanModal: React.FC<{
  onClose: () => void;
  onCreated: (planId: string) => void;
}> = ({ onClose, onCreated }) => {
  const navigate = useNavigate();
  const [rawInput, setRawInput] = useState('');
  const [budgetInput, setBudgetInput] = useState('');
  const [maxItems, setMaxItems] = useState(5);
  const [analyzing, setAnalyzing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [interpretation, setInterpretation] = useState<NeedInterpretation | null>(null);
  const [matchedProducts, setMatchedProducts] = useState<Product[]>([]);

  const analyze = async () => {
    if (rawInput.trim().length < 5) {
      setError('Ceritakan kebutuhanmu minimal 5 karakter.');
      return;
    }
    setAnalyzing(true);
    setError(null);
    setMatchedProducts([]);
    try {
      // Anggaran dari kolom "Anggaran (Rp)" ikut dianalisis, supaya AI tidak
      // mengira budget belum diisi padahal sudah.
      const aiText = rawInput.trim() + (budgetInput ? ` dengan anggaran ${budgetInput}` : '');
      const res = await interpretWithAI(aiText);
      setInterpretation(res.data.data);
      const aiBudget = res.data.data.interpretation.budget;
      if (aiBudget && !budgetInput) {
        setBudgetInput(String(aiBudget));
      }
      const categorySlug = res.data.data.interpretation.category;
      const budgetNum = Number(budgetInput) || (aiBudget ?? 0);
      if (categorySlug) {
        try {
          const params: GetProductsParams = { limit: 5, sort: 'rating' };
          if (budgetNum > 0) params.maxPrice = budgetNum;
          const matched = await getProductsByCategory(categorySlug, params);
          setMatchedProducts(matched.data ?? []);
        } catch {
          setMatchedProducts([]);
        }
      }
    } catch (err: any) {
      setError(err.message ?? 'Gagal menganalisis kebutuhan');
    } finally {
      setAnalyzing(false);
    }
  };

  const create = async () => {
    const budget = Number(budgetInput);
    if (!rawInput.trim() || !Number.isFinite(budget) || budget <= 0) {
      setError('Isi deskripsi kebutuhan dan anggaran terlebih dahulu.');
      return;
    }
    setCreating(true);
    setError(null);
    try {
      // 1. Simpan need + jalankan interpreter di server
      const needRes = await createNeed(rawInput.trim());
      const need = needRes.data.data.need;
      const parsed = needRes.data.data.parsed;
      const categoryId = parsed?.categoryId ?? null;

      // 2. Konfirmasi need (persist goal/budget/requirements/preferences)
      await confirmNeed(need.id, {
        goal: parsed?.goal ?? undefined,
        budget,
        location: parsed?.location ?? undefined,
        categoryId: categoryId ?? undefined,
        requirements: parsed?.requirements ?? [],
        preferences: parsed?.preferences ?? [],
      });

      // 3. Proses need → hasilkan rekomendasi
      await processNeed(need.id, categoryId ?? undefined);

      // 4. Buat rencana belanja, isi otomatis dari rekomendasi teratas
      const planRes = await createPlan({
        budget,
        needId: need.id,
        fromRecommendations: true,
        maxItems,
      });
      onCreated(planRes.data.data.id);
    } catch (err: any) {
      setError(err.message ?? 'Gagal membuat rencana belanja');
    } finally {
      setCreating(false);
    }
  };

  const inputCls =
    'w-full px-3 py-2 rounded-lg border border-[#c3c6d7] outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20 text-sm transition';
  const labelCls = 'block text-xs font-medium text-[#737686] mb-1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-[#e0e3e5]">
          <div>
            <h3 className="text-[15px] font-bold text-[#191c1e]">Buat Rencana Belanja</h3>
            <p className="text-[11px] text-[#737686] mt-0.5">Dianalisis otomatis dengan AI sesuai kebutuhanmu.</p>
          </div>
          <button onClick={onClose} className="text-[#737686] hover:text-[#191c1e] transition-colors">
            <Icon name="close" size={20} className="" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {error && (
            <div className="bg-[#ffdad6] border border-[#ba1a1a]/20 rounded-2xl px-4 py-3">
              <p className="text-[13px] text-[#93000a]">{error}</p>
            </div>
          )}

          <div>
            <label className={labelCls}>Deskripsi kebutuhan</label>
            <textarea
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              rows={3}
              placeholder="Contoh: saya butuh laptop untuk editing video dengan RAM 16GB"
              className={`${inputCls} resize-none`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Anggaran (Rp)</label>
              <input
                type="number"
                min={0}
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                placeholder="15000000"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Jumlah item maksimal</label>
              <input
                type="number"
                min={1}
                max={20}
                value={maxItems}
                onChange={(e) => setMaxItems(Number(e.target.value))}
                className={inputCls}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={analyze}
              disabled={analyzing}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-[#004ac6] text-[#004ac6] text-[13px] font-semibold hover:bg-[#dbe1ff]/40 transition-colors disabled:opacity-50"
            >
              {analyzing ? <Icon name="clock" size={16} className="animate-spin" /> : <Icon name="spark" size={16} className="" />}
              {analyzing ? 'Menganalisis...' : 'Analisis dengan AI'}
            </button>
            <button
              onClick={create}
              disabled={creating}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#004ac6] hover:bg-[#003ea8] text-white text-[13px] font-semibold transition-colors disabled:opacity-50"
            >
              {creating ? <Icon name="clock" size={16} className="animate-spin" /> : <Icon name="check" size={16} className="" />}
              {creating ? 'Membuat...' : 'Buat Rencana'}
            </button>
          </div>

          {/* Hasil analisis AI */}
          {interpretation && (
            <div className="bg-[#f2f6ff] border border-[#dbe1ff] rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="flex items-center gap-1.5 text-[13px] font-bold text-[#191c1e]">
                  <Icon name="spark" size={16} className="text-[#004ac6]" /> Hasil Analisis AI
                </p>
                <span className="text-[11px] text-[#737686]">
                  Keyakinan {Math.round((interpretation.confidenceScore ?? 0) * 100)}%
                </span>
              </div>

              <div className="space-y-1.5 text-[12px]">
                {interpretation.interpretation.goal && (
                  <p className="text-[#434655]">
                    <span className="text-[#737686]">Tujuan:</span> {interpretation.interpretation.goal}
                  </p>
                )}
                {interpretation.interpretation.budget && (
                  <p className="text-[#434655]">
                    <span className="text-[#737686]">Anggaran:</span> {formatRupiah(interpretation.interpretation.budget)}
                  </p>
                )}
                {interpretation.interpretation.category && (
                  <p className="text-[#434655]">
                    <span className="text-[#737686]">Kategori:</span> {interpretation.interpretation.category}
                  </p>
                )}
                {interpretation.interpretation.requirements.length > 0 && (
                  <p className="text-[#434655]">
                    <span className="text-[#737686]">Syarat:</span>{' '}
                    {interpretation.interpretation.requirements.map((r) => `${r.key}=${r.value}${r.isHardRequirement ? ' (wajib)' : ''}`).join(', ')}
                  </p>
                )}
                {interpretation.interpretation.preferences.length > 0 && (
                  <p className="text-[#434655]">
                    <span className="text-[#737686]">Preferensi:</span>{' '}
                    {interpretation.interpretation.preferences.map((p) => `${p.key}=${p.value}`).join(', ')}
                  </p>
                )}
              </div>

              {interpretation.needsClarification && (
                <div className="mt-3 bg-[#fff4e0] rounded-lg px-3 py-2">
                  <p className="text-[12px] font-semibold text-[#7c3e00] mb-1">
                    Informasi tambahan yang disarankan:
                  </p>
                  {interpretation.clarificationQuestions.map((q, i) => (
                    <p key={i} className="text-[12px] text-[#7c3e00]">• {q.question}</p>
                  ))}
                </div>
              )}

              {interpretation.absurdityDetected && (
                <div className="mt-3 bg-[#ffdad6] rounded-lg px-3 py-2 flex items-start gap-2">
                  <Icon name="alert" size={16} className="text-[#93000a] mt-0.5 shrink-0" />
                  <p className="text-[12px] text-[#93000a]">
                    {interpretation.absurdityNotes?.join(' ') ?? 'Kebutuhan tampak tidak masuk akal. Periksa kembali deskripsimu.'}
                  </p>
                </div>
              )}

              {matchedProducts.length > 0 && (
                <div className="mt-3">
                  <p className="flex items-center gap-1.5 text-[13px] font-bold text-[#191c1e] mb-2">
                    <Icon name="cart" size={16} className="text-[#004ac6]" /> Produk yang Cocok
                  </p>
                  <div className="space-y-2">
                    {matchedProducts.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => navigate(`/products/${p.slug}`)}
                        className="w-full flex items-center gap-3 bg-white border border-[#e0e3e5] rounded-xl p-2.5 hover:border-[#004ac6] hover:shadow-sm transition-all text-left"
                      >
                        <img
                          src={p.images.find((img) => img.isPrimary)?.url || p.images[0]?.url || ''}
                          alt={p.name}
                          className="w-11 h-11 rounded-lg object-cover bg-[#f2f4f7] shrink-0"
                          onError={(e) => ((e.target as HTMLImageElement).style.opacity = '0')}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-semibold text-[#191c1e] truncate">{p.name}</p>
                          <p className="text-[11px] text-[#737686]">{p.seller?.storeName}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[12px] font-bold text-[#004ac6]">{formatRupiah(p.price)}</p>
                          <p className="text-[10px] text-[#737686]">rating {p.rating}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-[11px] text-[#737686]">
                    Produk tersaring dari kategori &amp; anggaran di atas. Klik untuk melihat detail.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Tampilan Detail Rencana ───────────────────────────────────────────────────
const PlanDetail: React.FC<{ planId: string; onBack: () => void }> = ({ planId, onBack }) => {
  const navigate = useNavigate();
  const { plan, loading, error, refetch } = useShoppingPlan(planId);
  const { refreshCartCount } = useCartContext();
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleRemoveItem = async (itemId: string) => {
    setBusy(true);
    setActionError(null);
    try {
      await removePlanItem(planId, itemId);
      await refetch();
    } catch (err: any) {
      setActionError(err.message ?? 'Gagal menghapus item');
    } finally {
      setBusy(false);
    }
  };

  const handleAddToCart = async () => {
    setBusy(true);
    setActionError(null);
    try {
      await addPlanToCart(planId);
      await refreshCartCount();
      navigate('/cart');
    } catch (err: any) {
      setActionError(err.message ?? 'Gagal menambahkan ke keranjang');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Hapus rencana belanja ini?')) return;
    setBusy(true);
    setActionError(null);
    try {
      await deletePlan(planId);
      onBack();
    } catch (err: any) {
      setActionError(err.message ?? 'Gagal menghapus rencana');
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Navbar />
        <main className="flex-1 max-w-6xl mx-auto w-full px-5 sm:px-10 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-32 bg-[#e0e3e5] rounded" />
            <div className="h-8 w-64 bg-[#e0e3e5] rounded" />
            <div className="h-4 w-96 bg-[#e0e3e5] rounded" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Navbar />
        <main className="flex-1 max-w-6xl mx-auto w-full px-5 sm:px-10 py-8">
          <div className="text-center py-20 text-[#ba1a1a]">
            <p>{error ?? 'Rencana tidak ditemukan'}</p>
            <button onClick={onBack} className="mt-4 text-[#004ac6] hover:underline">
              Kembali ke daftar
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const status = statusMap[plan.status];
  const budgetNum = parseFloat(plan.budget);
  const totalNum = parseFloat(plan.total);

  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-5 sm:px-10 py-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-[13px] text-[#434655] hover:text-[#004ac6] transition-colors mb-4"
        >
          <Icon name="arrowLeft" size={14} className="" />
          Kembali ke Rencana
        </button>

        <h1 className="text-[28px] font-bold text-[#004ac6] leading-tight">
          Rencana Belanja
        </h1>
        <p className="text-[14px] text-[#737686] mt-1 mb-6">
          {plan.items.length} item{plan.items.length !== 1 ? '' : ''} • Anggaran: {formatRupiah(budgetNum)}
        </p>

        {(actionError) && (
          <div className="bg-[#ffdad6] border border-[#ba1a1a]/20 rounded-2xl px-4 py-3 mb-4">
            <p className="text-[13px] text-[#93000a]">{actionError}</p>
          </div>
        )}

        <div className="flex gap-6 items-start flex-col lg:flex-row">
          {/* Kiri: anggaran + wawasan */}
          <div className="w-full lg:w-72 shrink-0 space-y-4">
            <BudgetCard plan={plan} />

            <div className="bg-white border border-[#e0e3e5] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="trending" size={16} className="text-[#004ac6]" />
                <h3 className="text-[15px] font-bold text-[#191c1e]">Wawasan Anggaran</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-[#737686]">Total Anggaran</span>
                  <span className="text-[12px] font-semibold text-[#004ac6]">{formatRupiah(budgetNum)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-[#737686]">Item Direncanakan</span>
                  <span className="text-[13px] font-semibold text-[#191c1e]">{plan.items.length} Total</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-[#737686]">Status</span>
                  <span className={`text-[12px] font-semibold px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>
                    {status.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Kanan: daftar item */}
          <div className="flex-1 min-w-0">
            <div className="bg-white border border-[#e0e3e5] rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#e0e3e5]">
                <h3 className="text-[15px] font-bold text-[#004ac6]">Item Rencana</h3>
                <button className="flex items-center gap-1.5 text-[12px] text-[#434655] hover:text-[#004ac6] transition-colors">
                  <Icon name="filter" size={14} className="" />
                  Saring
                </button>
              </div>

              <div className="px-5">
                {plan.items.length === 0 ? (
                  <div className="py-12 text-center text-[#737686]">
                    Belum ada item di rencana ini.
                  </div>
                ) : (
                  plan.items.map((item) => (
                    <PlanItemRow
                      key={item.id}
                      item={item}
                      onRemove={() => handleRemoveItem(item.id)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bilah aksi bawah */}
      <div className="sticky bottom-0 bg-white border-t border-[#e0e3e5] px-5 sm:px-10 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-[11px] text-[#737686] uppercase tracking-wider">Total</p>
            <p className="text-[18px] font-bold text-[#191c1e]">{formatRupiah(totalNum)}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              disabled={busy}
              className="px-5 py-2.5 rounded-full border border-[#ba1a1a]/30 text-[#93000a] text-[14px] font-semibold hover:bg-[#ffdad6]/40 transition-colors disabled:opacity-50"
            >
              Hapus Rencana
            </button>
            <button
              onClick={handleAddToCart}
              disabled={busy || plan.items.length === 0}
              className="px-5 py-2.5 rounded-full bg-[#004ac6] hover:bg-[#003ea8] text-white text-[14px] font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {busy ? <Icon name="clock" size={16} className="animate-spin" /> : <Icon name="cart" size={16} className="" />}
              Masukkan ke Keranjang
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

// ─── Tampilan Daftar Rencana ───────────────────────────────────────────────────
const PlansListView: React.FC<{ onSelect: (planId: string) => void }> = ({ onSelect }) => {
  const { plans, loading, error, refetch } = useShoppingPlans();
  const [showCreate, setShowCreate] = useState(false);
  const [isAuthed] = useState(() => !!getAccessToken());

  const handleCreated = (planId: string) => {
    setShowCreate(false);
    refetch();
    onSelect(planId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Navbar />
        <main className="flex-1 max-w-6xl mx-auto w-full px-5 sm:px-10 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white border border-[#e0e3e5] rounded-2xl p-5 animate-pulse">
                <div className="h-5 w-32 bg-[#e0e3e5] rounded mb-2" />
                <div className="h-4 w-48 bg-[#e0e3e5] rounded mb-4" />
                <div className="h-1.5 bg-[#e0e3e5] rounded-full" />
              </div>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-5 sm:px-10 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[28px] font-bold text-[#191c1e]">Rencana Belanja</h1>
            <p className="text-[14px] text-[#737686] mt-1">Kelola rencana belanja dan anggaran Anda.</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#004ac6] hover:bg-[#003ea8] text-white text-[14px] font-semibold transition-colors"
          >
            <Icon name="plus" size={16} className="" />
            Buat Rencana
          </button>
        </div>

        {error && (
          <div className="bg-[#ffdad6] border border-[#ba1a1a]/20 rounded-2xl px-4 py-3 mb-4">
            <p className="text-[13px] text-[#93000a]">{error}</p>
          </div>
        )}

        {plans.length === 0 && !loading ? (
          <div className="text-center py-20">
            <Icon name="cart" size={48} className="text-[#c3c6d7] mx-auto mb-4" />
            <p className="text-[#737686] mb-4">Belum ada rencana belanja.</p>
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#004ac6] hover:bg-[#003ea8] text-white text-[14px] font-semibold transition-colors"
            >
              <Icon name="plus" size={16} className="" />
              Buat Rencana Pertama
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plans.map((plan) => {
              const budgetNum = parseFloat(plan.budget);
              const totalNum = parseFloat(plan.total);
              const pct = budgetNum > 0 ? Math.min(100, Math.round((totalNum / budgetNum) * 100)) : 0;
              const status = statusMap[plan.status];

              return (
                <button
                  key={plan.id}
                  onClick={() => onSelect(plan.id)}
                  className="text-left bg-white border border-[#e0e3e5] rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-[16px] font-bold text-[#191c1e]">Rencana Belanja</h3>
                      <p className="text-[13px] text-[#737686] mt-0.5 line-clamp-1">
                        {plan._count?.items ?? 0} item
                        {plan.needId && ' • Dari Kebutuhan'}
                      </p>
                    </div>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ml-3 ${status.bg} ${status.color}`}>
                      {status.label}
                    </span>
                  </div>

                  <div className="flex justify-between text-[13px] mb-2">
                    <span className="text-[#737686]">Anggaran: <span className="font-semibold text-[#191c1e]">{formatRupiah(budgetNum)}</span></span>
                    <span className="text-[#004ac6] font-semibold">{pct}% terpakai</span>
                  </div>
                  <div className="h-1.5 bg-[#e0e3e5] rounded-full overflow-hidden">
                    <div className="h-full bg-[#004ac6] rounded-full" style={{ width: `${pct}%` }} />
                  </div>

                  <p className="mt-3 text-[12px] text-[#737686]">
                    {plan._count?.items ?? 0} item • {formatRupiah(totalNum)} terpakai
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal buat rencana */}
      {showCreate && (
        isAuthed ? (
          <CreatePlanModal onClose={() => setShowCreate(false)} onCreated={handleCreated} />
        ) : (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
              <div className="flex items-center justify-between p-4 border-b border-[#e0e3e5]">
                <h3 className="text-[15px] font-bold text-[#191c1e]">Login Diperlukan</h3>
                <button onClick={() => setShowCreate(false)} className="text-[#737686] hover:text-[#191c1e]">
                  <Icon name="close" size={20} className="" />
                </button>
              </div>
              <div className="p-5 text-center">
                <Icon name="lock" size={40} className="text-[#c3c6d7] mx-auto mb-3" />
                <p className="text-[13px] text-[#737686] mb-4">Login untuk membuat rencana belanja.</p>
                <button
                  onClick={() => (window.location.href = '/login')}
                  className="px-6 py-2.5 rounded-full bg-[#004ac6] text-white text-[14px] font-semibold"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        )
      )}

      <Footer />
    </div>
  );
};

// ─── Akar Halaman — kelola status daftar vs detail ─────────────────────────────
const ShoppingPlansPage: React.FC = () => {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  if (selectedPlanId) {
    return <PlanDetail planId={selectedPlanId} onBack={() => setSelectedPlanId(null)} />;
  }
  return <PlansListView onSelect={setSelectedPlanId} />;
};

export default ShoppingPlansPage;
