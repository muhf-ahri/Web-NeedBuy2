// src/pages/CartPage.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/ui/Icon';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { formatRupiah } from '../utils/currency';
import { getCart, updateCartItem, removeFromCart, clearCart, setCartBudget, type Cart } from '../api/cart';
import { getAccessToken } from '../api/auth';
import { useCart as useCartContext } from '../contexts/CartContext';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { refreshCartCount } = useCartContext();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [budgetInput, setBudgetInput] = useState('');
  const [busy, setBusy] = useState(false);
  // Item yang ikut di-checkout. Saat halaman dimuat semua item yang tersedia
  // terpilih; item yang hilang dari cart dibuang dari pilihan supaya id basi
  // tidak pernah ikut terkirim ke server.
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const isAuthed = !!getAccessToken();

  const fetchCart = useCallback(async () => {
    if (!isAuthed) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await getCart();
      setCart(res.data.data);
    } catch (err: any) {
      setError(err.message ?? 'Gagal memuat keranjang');
    } finally {
      setLoading(false);
    }
  }, [isAuthed]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    if (!cart) return;
    const available = cart.items
      .filter((item) => !cart.unavailableItems.some((u) => u.cartItemId === item.id))
      .map((item) => item.id);
    setSelectedIds((prev) => {
      const known = new Set(cart.items.map((item) => item.id));
      const kept = [...prev].filter((id) => known.has(id));
      // Pertama kali dimuat: semua item yang tersedia ikut terpilih.
      return new Set(kept.length > 0 || prev.size > 0 ? kept : available);
    });
  }, [cart]);

  const mutate = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    try {
      await fn();
      await fetchCart();
      await refreshCartCount();
    } catch (err: any) {
      setError(err.message ?? 'Terjadi kesalahan');
    } finally {
      setBusy(false);
    }
  };

  const handleQty = (itemId: string, quantity: number) =>
    mutate(() => updateCartItem(itemId, quantity));

  const handleRemove = (itemId: string) => mutate(() => removeFromCart(itemId));

  const handleClear = () => mutate(() => clearCart());

  const handleBudget = () => {
    const value = budgetInput.trim();
    if (!value) return;
    mutate(() => setCartBudget(Number(value)));
  };

  if (!isAuthed) {
    return (
      <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Navbar />
        <main className="flex-1 max-w-6xl mx-auto w-full px-5 sm:px-10 py-16 flex items-center justify-center">
          <div className="text-center">
            <Icon name="cart" size={48} className="text-[#c3c6d7] mx-auto mb-4" />
            <p className="text-[#737686] mb-4">Login untuk melihat keranjang Anda.</p>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2.5 rounded-full bg-[#004ac6] hover:bg-[#003ea8] text-white text-[14px] font-semibold transition-colors"
            >
              Login
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Navbar />
        <main className="flex-1 max-w-6xl mx-auto w-full px-5 sm:px-10 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-[#e0e3e5] rounded" />
            <div className="h-32 bg-[#f2f4f6] rounded-2xl" />
            <div className="h-32 bg-[#f2f4f6] rounded-2xl" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Item bermasalah stok tidak boleh ikut dipilih — checkout-nya pasti ditolak server.
  const allSelectable = cart
    ? cart.items
        .filter((item) => !cart.unavailableItems.some((u) => u.cartItemId === item.id))
        .map((item) => item.id)
    : [];
  const selectedItems = cart ? cart.items.filter((item) => selectedIds.has(item.id)) : [];
  // Angka yang ditampilkan harus sama dengan yang akan dibayar, jadi subtotal
  // dihitung dari item terpilih — bukan dari cart.subtotal yang mencakup semua.
  const subtotal = selectedItems.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
  const budget = cart?.budget ? parseFloat(cart.budget) : null;
  const pct = budget && budget > 0 ? Math.min(100, Math.round((subtotal / budget) * 100)) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-5 sm:px-10 py-8">
        <h1 className="text-[28px] font-bold text-[#191c1e] mb-6">Keranjang</h1>

        {error && (
          <div className="bg-[#ffdad6] border border-[#ba1a1a]/20 rounded-2xl px-4 py-3 mb-4">
            <p className="text-[13px] text-[#93000a]">{error}</p>
          </div>
        )}

        {!cart || cart.items.length === 0 ? (
          <div className="text-center py-20">
            <Icon name="cart" size={48} className="text-[#c3c6d7] mx-auto mb-4" />
            <p className="text-[#737686] mb-4">Keranjang Anda kosong.</p>
            <button
              onClick={() => navigate('/categories')}
              className="px-6 py-2.5 rounded-full bg-[#004ac6] hover:bg-[#003ea8] text-white text-[14px] font-semibold transition-colors"
            >
              Mulai Belanja
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* ── Item list ── */}
            <div className="lg:col-span-2 bg-white border border-[#e0e3e5] rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#e0e3e5]">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allSelectable.length > 0 && selectedIds.size === allSelectable.length}
                    ref={(el) => {
                      if (el) el.indeterminate = selectedIds.size > 0 && selectedIds.size < allSelectable.length;
                    }}
                    onChange={(e) =>
                      setSelectedIds(e.target.checked ? new Set(allSelectable) : new Set())
                    }
                    className="w-4 h-4 accent-[#004ac6] cursor-pointer"
                  />
                  <span className="text-[15px] font-bold text-[#004ac6]">
                    {selectedIds.size} dari {cart.items.length} item dipilih
                  </span>
                </label>
                <button
                  onClick={handleClear}
                  disabled={busy}
                  className="text-[12px] text-[#ba1a1a] hover:underline disabled:opacity-50"
                >
                  Kosongkan Keranjang
                </button>
              </div>

              <div className="px-5">
                {cart.items.map((item) => {
                  const unavailable = cart.unavailableItems.some((u) => u.cartItemId === item.id);
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between py-4 border-b border-[#e0e3e5] last:border-0 ${
                        unavailable ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(item.id)}
                          disabled={unavailable}
                          onChange={(e) =>
                            setSelectedIds((prev) => {
                              const next = new Set(prev);
                              if (e.target.checked) next.add(item.id);
                              else next.delete(item.id);
                              return next;
                            })
                          }
                          className="w-4 h-4 accent-[#004ac6] cursor-pointer disabled:cursor-not-allowed shrink-0"
                          aria-label={`Pilih ${item.product.name} untuk checkout`}
                        />
                        <img
                          src={item.product.images[0]?.url}
                          alt={item.product.name}
                          className="w-14 h-14 rounded-xl object-cover bg-[#f2f4f6] shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-[14px] font-semibold text-[#191c1e] leading-tight truncate">
                            {item.product.name}
                          </p>
                          <p className="text-[12px] text-[#737686]">{item.product.seller.storeName}</p>
                          <p className="text-[12px] text-[#004ac6] font-semibold mt-0.5">
                            {formatRupiah(item.priceAtAdd)}
                          </p>
                          {unavailable && (
                            <p className="text-[11px] text-[#ba1a1a]">Stok tidak tersedia, perbarui atau hapus.</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center border border-[#c3c6d7] rounded-lg">
                          <button
                            onClick={() => handleQty(item.id, Math.max(1, item.quantity - 1))}
                            disabled={busy || item.quantity <= 1}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-40"
                          >
                            <Icon name="minus" size={14} className="" />
                          </button>
                          <span className="w-10 text-center text-[13px] font-medium">{item.quantity}</span>
                          <button
                            onClick={() => handleQty(item.id, Math.min(item.product.stock, item.quantity + 1))}
                            disabled={busy || item.quantity >= item.product.stock}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-40"
                          >
                            <Icon name="plus" size={14} className="" />
                          </button>
                        </div>
                        <span className="text-[14px] font-bold text-[#191c1e] w-24 text-right">
                          {formatRupiah(item.subtotal)}
                        </span>
                        <button
                          onClick={() => handleRemove(item.id)}
                          disabled={busy}
                          className="text-[#737686] hover:text-[#ba1a1a] transition-colors disabled:opacity-50"
                          aria-label="Hapus item"
                        >
                          <Icon name="trash" size={16} className="" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Summary ── */}
            <div className="space-y-4">
              <div className="bg-[#191c1e] rounded-2xl p-5 text-white">
                <p className="text-[10px] font-semibold text-[#9ea3b0] uppercase tracking-widest mb-1">
                  Subtotal {selectedItems.length} item terpilih
                </p>
                <p className="text-[26px] font-bold leading-tight">{formatRupiah(subtotal)}</p>

                {budget !== null && (
                  <div className="mt-4">
                    <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] text-[#9ea3b0]">
                      {pct}% dari budget {formatRupiah(budget)}
                    </p>
                  </div>
                )}

                <div className="mt-4 flex items-center gap-2">
                  <input
                    type="number"
                    value={budgetInput}
                    onChange={(e) => setBudgetInput(e.target.value)}
                    placeholder={budget !== null ? formatRupiah(budget) : 'Set budget keranjang'}
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-[12px] text-white placeholder-[#9ea3b0] outline-none focus:border-[#004ac6]"
                  />
                  <button
                    onClick={handleBudget}
                    disabled={busy || !budgetInput.trim()}
                    className="px-3 py-2 rounded-lg bg-white text-[#191c1e] text-[12px] font-semibold hover:bg-[#e0e3e5] transition-colors disabled:opacity-50"
                  >
                    {budget !== null ? 'Ubah' : 'Simpan'}
                  </button>
                </div>
                {budget !== null && (
                  <button
                    onClick={() => mutate(() => setCartBudget(null))}
                    disabled={busy}
                    className="mt-2 text-[11px] text-[#9ea3b0] hover:text-white transition-colors disabled:opacity-50"
                  >
                    Hapus budget
                  </button>
                )}
              </div>

              <button
                onClick={() => navigate('/checkout', { state: { cartItemIds: [...selectedIds] } })}
                disabled={selectedIds.size === 0}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#004ac6] hover:bg-[#003ea8] text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon name="lock" size={16} className="" />
                {selectedIds.size === 0
                  ? 'Pilih item dulu'
                  : `Checkout ${selectedIds.size} item`}
              </button>
              <button
                onClick={() => navigate('/categories')}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[#c3c6d7] text-[#191c1e] font-semibold hover:border-[#004ac6] hover:text-[#004ac6] transition-colors"
              >
                Lanjut Belanja
                <Icon name="arrowRight" size={16} className="" />
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
