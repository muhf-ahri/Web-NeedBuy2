// src/pages/ShoppingPlansPage.tsx
//
// Rencana Belanja = grup belanja. User bikin kategori sendiri (mis. "Kamar"),
// isi dengan produk (kipas, lampu, ...), lalu checkout satu grup sekaligus
// tanpa mencentang item satu per satu di keranjang.
//
// Alur AI (kebutuhan → rekomendasi → rencana otomatis) pindah ke /needs.
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../components/ui/Icon';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { formatRupiah } from '../utils/currency';
import { useShoppingPlans, useShoppingPlan } from '../hooks/useShoppingPlans';
import {
  createPlan, updatePlan, deletePlan, addItemToPlan, updatePlanItem, removePlanItem,
  addPlanToCart, type ShoppingPlan, type ShoppingPlanItem,
} from '../api/plans';
import { getCart } from '../api/cart';
import { useSearchSuggestions } from '../hooks/useSearchSuggestions';
import { getAccessToken } from '../api/auth';
import { useCart as useCartContext } from '../contexts/CartContext';

const planTitle = (plan: { name: string | null }) => plan.name ?? 'Tanpa Nama';

const btnPrimary =
  'flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#004ac6] hover:bg-[#003ea8] text-white text-[14px] font-semibold transition-colors disabled:opacity-50';
const inputCls =
  'w-full px-3 py-2 rounded-lg border border-[#c3c6d7] outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20 text-sm transition';
const labelCls = 'block text-xs font-medium text-[#737686] mb-1';

// ─── Cangkang modal ────────────────────────────────────────────────────────────
const Sheet: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({
  title, onClose, children,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[85vh] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-[#e0e3e5]">
        <h3 className="text-[15px] font-bold text-[#191c1e]">{title}</h3>
        <button onClick={onClose} className="text-[#737686] hover:text-[#191c1e] transition-colors">
          <Icon name="close" size={20} className="" />
        </button>
      </div>
      <div className="p-5 overflow-y-auto">{children}</div>
    </div>
  </div>
);

// ─── Modal buat / ubah kategori ────────────────────────────────────────────────
const CategoryModal: React.FC<{
  initial?: { name: string; budget: string };
  planId?: string;
  onClose: () => void;
  onSaved: (planId: string) => void;
}> = ({ initial, planId, onClose, onSaved }) => {
  const [name, setName] = useState(initial?.name ?? '');
  const [budget, setBudget] = useState(initial?.budget ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Nama kategorinya diisi dulu ya.');
      return;
    }
    const budgetNum = Number(budget) || 0;
    if (budgetNum < 0) {
      setError('Anggaran nggak boleh minus.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (planId) {
        await updatePlan(planId, { name: trimmed, budget: budgetNum });
        onSaved(planId);
      } else {
        const res = await createPlan({ name: trimmed, budget: budgetNum });
        onSaved(res.data.data.id);
      }
    } catch (err: any) {
      setError(err.message ?? 'Gagal simpan kategori, coba lagi ya');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet title={planId ? 'Ubah Kategori' : 'Buat Kategori Belanja'} onClose={onClose}>
      <div className="space-y-4">
        {error && (
          <div className="bg-[#ffdad6] border border-[#ba1a1a]/20 rounded-xl px-4 py-3">
            <p className="text-[13px] text-[#93000a]">{error}</p>
          </div>
        )}
        <div>
          <label className={labelCls}>Nama kategori</label>
          <input
            autoFocus
            value={name}
            maxLength={60}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && save()}
            placeholder="Contoh: Kamar"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Anggaran (opsional)</label>
          <input
            type="number"
            min={0}
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Kosongkan kalau nggak pakai anggaran"
            className={inputCls}
          />
        </div>
        <button onClick={save} disabled={saving} className={`${btnPrimary} w-full`}>
          {saving && <Icon name="clock" size={16} className="animate-spin" />}
          {planId ? 'Simpan Perubahan' : 'Buat Kategori'}
        </button>
      </div>
    </Sheet>
  );
};

// ─── Modal cari & tambah produk ke kategori ────────────────────────────────────
const AddProductModal: React.FC<{
  planId: string;
  onClose: () => void;
  onAdded: () => void;
}> = ({ planId, onClose, onAdded }) => {
  const [term, setTerm] = useState('');
  const { products, loading } = useSearchSuggestions(term);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const add = async (productId: string) => {
    setBusyId(productId);
    setError(null);
    try {
      await addItemToPlan(planId, productId, 1);
      onAdded();
    } catch (err: any) {
      setError(err.message ?? 'Gagal tambah produk, coba lagi ya');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Sheet title="Tambah Produk ke Kategori" onClose={onClose}>
      <input
        autoFocus
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Cari produk... (mis. kipas angin)"
        className={inputCls}
      />

      {error && <p className="mt-3 text-[13px] text-[#93000a]">{error}</p>}

      <div className="mt-4 space-y-2">
        {term.trim().length < 2 ? (
          <p className="text-[12px] text-[#737686] text-center py-6">
            Ketik minimal 2 huruf buat cari produk.
          </p>
        ) : loading ? (
          <>
            <div className="h-14 bg-[#f2f4f6] rounded-xl animate-pulse" />
            <div className="h-14 bg-[#f2f4f6] rounded-xl animate-pulse" />
          </>
        ) : products.length === 0 ? (
          <p className="text-[12px] text-[#737686] text-center py-6">Produknya nggak ketemu.</p>
        ) : (
          products.map((p) => (
            <div key={p.id} className="flex items-center gap-3 bg-[#f8f9fb] rounded-xl p-2.5">
              <img
                src={p.images.find((img) => img.isPrimary)?.url || p.images[0]?.url || ''}
                alt={p.name}
                className="w-11 h-11 rounded-lg object-cover bg-white shrink-0"
                onError={(e) => ((e.target as HTMLImageElement).style.opacity = '0')}
              />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#191c1e] truncate">{p.name}</p>
                <p className="text-[12px] text-[#004ac6] font-bold">{formatRupiah(p.price)}</p>
              </div>
              <button
                onClick={() => add(p.id)}
                disabled={busyId === p.id}
                className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#191c1e] hover:bg-[#004ac6] text-white text-[11px] font-semibold transition-colors disabled:opacity-50"
              >
                {busyId === p.id ? <Icon name="clock" size={12} className="animate-spin" /> : <Icon name="plus" size={12} className="" />}
                Tambah
              </button>
            </div>
          ))
        )}
      </div>
    </Sheet>
  );
};

// ─── Baris item di dalam kategori ──────────────────────────────────────────────
const ItemRow: React.FC<{
  item: ShoppingPlanItem;
  disabled: boolean;
  onQty: (quantity: number) => void;
  onRemove: () => void;
}> = ({ item, disabled, onQty, onRemove }) => (
  <div className="flex items-center gap-3 py-3 border-b border-[#e0e3e5] last:border-0">
    <img
      src={item.product.images?.find((img) => img.isPrimary)?.url || item.product.images?.[0]?.url || ''}
      alt={item.product.name}
      className="w-11 h-11 rounded-lg object-cover bg-[#f2f4f7] shrink-0"
      onError={(e) => ((e.target as HTMLImageElement).style.opacity = '0')}
    />
    <div className="flex-1 min-w-0">
      <p className="text-[14px] font-semibold text-[#191c1e] truncate">{item.product.name}</p>
      <p className="text-[12px] text-[#737686]">{item.product.category?.name}</p>
    </div>

    <div className="flex items-center gap-1 shrink-0">
      <button
        onClick={() => onQty(item.quantity - 1)}
        disabled={disabled || item.quantity <= 1}
        className="w-7 h-7 rounded-full border border-[#c3c6d7] text-[#434655] disabled:opacity-40"
        aria-label="Kurangi jumlah"
      >
        −
      </button>
      <span className="w-7 text-center text-[13px] font-semibold">{item.quantity}</span>
      <button
        onClick={() => onQty(item.quantity + 1)}
        disabled={disabled}
        className="w-7 h-7 rounded-full border border-[#c3c6d7] text-[#434655] disabled:opacity-40"
        aria-label="Tambah jumlah"
      >
        +
      </button>
    </div>

    <div className="text-right shrink-0 w-28">
      <p className="text-[14px] font-bold text-[#191c1e]">{formatRupiah(parseFloat(item.subtotal))}</p>
      <button
        onClick={onRemove}
        disabled={disabled}
        className="text-[11px] text-[#ba1a1a] hover:underline inline-flex items-center gap-0.5 disabled:opacity-50"
      >
        <Icon name="trash" size={12} className="" />
        Hapus
      </button>
    </div>
  </div>
);

// ─── Detail satu kategori ──────────────────────────────────────────────────────
const CategoryDetail: React.FC<{ planId: string; onBack: () => void }> = ({ planId, onBack }) => {
  const navigate = useNavigate();
  const { plan, loading, error, refetch } = useShoppingPlan(planId);
  const { refreshCartCount } = useCartContext();
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

  // Checkout satu kategori: masukkan semua item ke keranjang, lalu bawa HANYA
  // item kategori ini ke halaman checkout. Halaman checkout memilih berdasar
  // cartItemIds, jadi user tidak perlu mencentang ulang satu per satu.
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
        setActionError('Nggak ada item yang bisa di-checkout dari kategori ini.');
        return;
      }
      if (result.data.data.failed.length > 0) {
        // Item yang gagal (stok habis / nonaktif) tidak menghentikan sisanya.
        console.warn('[plan checkout] item gagal masuk keranjang:', result.data.data.failed);
      }
      navigate('/checkout', { state: { cartItemIds } });
    });

  const handleDelete = () =>
    run(async () => {
      if (!window.confirm('Yakin mau hapus kategori ini beserta isinya?')) return;
      await deletePlan(planId);
      onBack();
    });

  if (loading || error || !plan) {
    return (
      <Shell>
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-32 bg-[#e0e3e5] rounded" />
            <div className="h-8 w-64 bg-[#e0e3e5] rounded" />
            <div className="h-24 bg-[#f2f4f6] rounded-2xl" />
          </div>
        ) : (
          <div className="text-center py-20 text-[#ba1a1a]">
            <p>{error ?? 'Kategorinya nggak ketemu'}</p>
            <button onClick={onBack} className="mt-4 text-[#004ac6] hover:underline">
              Kembali ke daftar
            </button>
          </div>
        )}
      </Shell>
    );
  }

  const budgetNum = parseFloat(plan.budget);
  const totalNum = parseFloat(plan.total);
  const overBudget = budgetNum > 0 && totalNum > budgetNum;

  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-5 sm:px-10 py-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-[13px] text-[#434655] hover:text-[#004ac6] transition-colors mb-4"
        >
          <Icon name="arrowLeft" size={14} className="" />
          Kembali ke Kategori
        </button>

        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-[28px] font-bold text-[#191c1e] leading-tight">{planTitle(plan)}</h1>
            <p className="text-[14px] text-[#737686] mt-1">
              {plan.items.length} produk
              {budgetNum > 0 && ` • Anggaran ${formatRupiah(budgetNum)}`}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowEdit(true)}
              className="px-4 py-2 rounded-full border border-[#c3c6d7] text-[#434655] text-[13px] font-semibold hover:border-[#004ac6] hover:text-[#004ac6] transition-colors"
            >
              Ubah
            </button>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#004ac6] hover:bg-[#003ea8] text-white text-[13px] font-semibold transition-colors"
            >
              <Icon name="plus" size={14} className="" />
              Tambah Produk
            </button>
          </div>
        </div>

        {actionError && (
          <div className="bg-[#ffdad6] border border-[#ba1a1a]/20 rounded-2xl px-4 py-3 mt-4">
            <p className="text-[13px] text-[#93000a]">{actionError}</p>
          </div>
        )}

        {overBudget && (
          <div className="bg-[#fff4e0] rounded-2xl px-4 py-3 mt-4 flex items-center gap-2">
            <Icon name="alert" size={16} className="text-[#7c3e00] shrink-0" />
            <p className="text-[13px] text-[#7c3e00]">
              Lewat anggaran {formatRupiah(totalNum - budgetNum)}.
            </p>
          </div>
        )}

        <div className="mt-6 bg-white border border-[#e0e3e5] rounded-2xl px-5">
          {plan.items.length === 0 ? (
            <div className="py-14 text-center">
              <Icon name="cart" size={40} className="text-[#c3c6d7] mx-auto mb-3" />
              <p className="text-[#737686] text-[14px]">Kategori ini masih kosong.</p>
              <button onClick={() => setShowAdd(true)} className="mt-4 text-[#004ac6] text-[13px] font-semibold hover:underline">
                Tambah produk pertama
              </button>
            </div>
          ) : (
            plan.items.map((item) => (
              <ItemRow
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
            ))
          )}
        </div>
      </main>

      <div className="sticky bottom-0 bg-white border-t border-[#e0e3e5] px-5 sm:px-10 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="text-[11px] text-[#737686] uppercase tracking-wider">Total kategori</p>
            <p className="text-[18px] font-bold text-[#191c1e]">{formatRupiah(totalNum)}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              disabled={busy}
              className="px-5 py-2.5 rounded-full border border-[#ba1a1a]/30 text-[#93000a] text-[14px] font-semibold hover:bg-[#ffdad6]/40 transition-colors disabled:opacity-50"
            >
              Hapus Kategori
            </button>
            <button onClick={handleCheckoutAll} disabled={busy || plan.items.length === 0} className={btnPrimary}>
              {busy ? <Icon name="clock" size={16} className="animate-spin" /> : <Icon name="cart" size={16} className="" />}
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
          initial={{ name: plan.name ?? '', budget: budgetNum > 0 ? String(budgetNum) : '' }}
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

// ─── Kerangka halaman ──────────────────────────────────────────────────────────
const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
    <Navbar />
    <main className="flex-1 max-w-5xl mx-auto w-full px-5 sm:px-10 py-8">{children}</main>
    <Footer />
  </div>
);

// ─── Kartu kategori ────────────────────────────────────────────────────────────
const CategoryCard: React.FC<{
  plan: Pick<ShoppingPlan, 'id' | 'name' | 'budget' | 'total' | 'needId'> & { _count?: { items: number } };
  onClick: () => void;
}> = ({ plan, onClick }) => {
  const budgetNum = parseFloat(plan.budget);
  const totalNum = parseFloat(plan.total);
  const pct = budgetNum > 0 ? Math.min(100, Math.round((totalNum / budgetNum) * 100)) : 0;
  const count = plan._count?.items ?? 0;

  return (
    <button
      onClick={onClick}
      className="text-left bg-white border border-[#e0e3e5] rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#dbe1ff] flex items-center justify-center shrink-0">
          <Icon name="grid" size={18} className="text-[#004ac6]" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-[16px] font-bold text-[#191c1e] truncate">{planTitle(plan)}</h3>
          <p className="text-[13px] text-[#737686] mt-0.5">
            {count} produk{plan.needId && ' • dari Kebutuhan'}
          </p>
        </div>
      </div>

      <p className="mt-4 text-[18px] font-bold text-[#004ac6]">{formatRupiah(totalNum)}</p>

      {budgetNum > 0 && (
        <>
          <div className="mt-2 h-1.5 bg-[#e0e3e5] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${totalNum > budgetNum ? 'bg-[#ba1a1a]' : 'bg-[#004ac6]'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-1.5 text-[12px] text-[#737686]">
            {pct}% dari anggaran {formatRupiah(budgetNum)}
          </p>
        </>
      )}
    </button>
  );
};

// ─── Daftar kategori ───────────────────────────────────────────────────────────
const CategoriesListView: React.FC<{ onSelect: (planId: string) => void }> = ({ onSelect }) => {
  const { plans, loading, error, refetch } = useShoppingPlans();
  const [showCreate, setShowCreate] = useState(false);
  const isAuthed = !!getAccessToken();

  if (loading) {
    return (
      <Shell>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-[#f2f4f6] rounded-2xl animate-pulse" />
          ))}
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="flex items-center justify-between mb-8 gap-3 flex-wrap">
        <div>
          <h1 className="text-[28px] font-bold text-[#191c1e]">Rencana Belanja</h1>
          <p className="text-[14px] text-[#737686] mt-1">
            Kelompokkan belanjaanmu per kategori — mis. "Kamar" isi kipas &amp; lampu — terus checkout sekaligus.
          </p>
        </div>
        <button onClick={() => setShowCreate(true)} className={btnPrimary}>
          <Icon name="plus" size={16} className="" />
          Buat Kategori
        </button>
      </div>

      {error && (
        <div className="bg-[#ffdad6] border border-[#ba1a1a]/20 rounded-2xl px-4 py-3 mb-4">
          <p className="text-[13px] text-[#93000a]">{error}</p>
        </div>
      )}

      {plans.length === 0 ? (
        <div className="text-center py-20">
          <Icon name="grid" size={48} className="text-[#c3c6d7] mx-auto mb-4" />
          <p className="text-[#737686] mb-4">Belum ada kategori belanja nih.</p>
          <button onClick={() => setShowCreate(true)} className={`${btnPrimary} mx-auto`}>
            <Icon name="plus" size={16} className="" />
            Buat Kategori Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <CategoryCard key={plan.id} plan={plan} onClick={() => onSelect(plan.id)} />
          ))}
        </div>
      )}

      {showCreate && (
        isAuthed ? (
          <CategoryModal
            onClose={() => setShowCreate(false)}
            onSaved={(planId) => {
              setShowCreate(false);
              refetch();
              onSelect(planId);
            }}
          />
        ) : (
          <Sheet title="Login Dulu Ya" onClose={() => setShowCreate(false)}>
            <div className="text-center">
              <Icon name="lock" size={40} className="text-[#c3c6d7] mx-auto mb-3" />
              <p className="text-[13px] text-[#737686] mb-4">Login dulu ya buat bikin kategori belanja.</p>
              <button onClick={() => (window.location.href = '/login')} className={`${btnPrimary} mx-auto`}>
                Login
              </button>
            </div>
          </Sheet>
        )
      )}
    </Shell>
  );
};

const ShoppingPlansPage: React.FC = () => {
  // /needs mengirim planId lewat state saat "Jadikan Rencana" — langsung buka.
  const fromNeeds = (useLocation().state as { planId?: string } | null)?.planId ?? null;
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(fromNeeds);

  return selectedPlanId ? (
    <CategoryDetail planId={selectedPlanId} onBack={() => setSelectedPlanId(null)} />
  ) : (
    <CategoriesListView onSelect={setSelectedPlanId} />
  );
};

export default ShoppingPlansPage;
