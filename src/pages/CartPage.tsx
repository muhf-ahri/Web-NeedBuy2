import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Icon from '../components/ui/Icon';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Reveal from '../components/ui/Reveal';

import CartLoginPrompt from '../components/cart/CartLoginPrompt';
import CartEmptyState from '../components/cart/CartEmptyState';
import CartItemRow from '../components/cart/CartItemRow';
import CartSummary from '../components/cart/CartSummary';

import {
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  setCartBudget,
  type Cart,
} from '../api/cart';
import { getAccessToken } from '../api/auth';
import { useCart as useCartContext } from '../contexts/CartContext';

const stagger = (index: number, base = 60) => Math.min(index, 11) * base;

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { refreshCartCount } = useCartContext();

  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [budgetInput, setBudgetInput] = useState('');
  const [busy, setBusy] = useState(false);
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
      setError(err.message ?? 'Gagal muat keranjang, coba lagi ya');
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
      setError(err.message ?? 'Waduh, ada yang error. Coba lagi ya.');
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

  if (!isAuthed) return <CartLoginPrompt />;

  if (loading) {
    return (
      <div
        className="min-h-screen flex flex-col bg-[#F5F5FF]"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <Navbar />
        <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8 sm:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 rounded-full bg-[#E8ECF4]" />
            <div className="h-4 w-72 rounded-full bg-[#E8ECF4]" />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="h-80 rounded-[24px] bg-white/95 lg:col-span-2" />
              <div className="h-64 rounded-[24px] bg-white/95" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const allSelectable = cart
    ? cart.items
        .filter((item) => !cart.unavailableItems.some((u) => u.cartItemId === item.id))
        .map((item) => item.id)
    : [];
  const selectedItems = cart ? cart.items.filter((item) => selectedIds.has(item.id)) : [];
  const subtotal = selectedItems.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
  const budget = cart?.budget ? parseFloat(cart.budget) : null;
  const pct = budget && budget > 0 ? Math.min(100, Math.round((subtotal / budget) * 100)) : 0;

  return (
    <div
      className="min-h-screen flex flex-col bg-[#F5F5FF]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8 sm:px-8">
        {/* Header */}
        <Reveal direction="up">
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#538CDB]/10 px-2.5 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
                <p className="text-[9px] font-bold uppercase tracking-[0.20em] text-[#538CDB]">
                  Keranjang belanja
                </p>
              </span>
            </div>
            <h1 className="text-[26px] font-extrabold leading-tight tracking-tight text-[#20242D] sm:text-[32px]">
              Keranjang
            </h1>
            <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-[#737A87]">
              Centang barang yang mau dibayar sekarang. Sisanya tetap
              tersimpan rapi di sini.
            </p>
          </div>
        </Reveal>

        {/* Error */}
        {error && (
          <Reveal direction="up">
            <div
              className="
                mb-5 flex items-center gap-3 rounded-2xl border
                border-[#FF4646]/20 bg-[#FFF0F0] px-4 py-3 backdrop-blur-sm
              "
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF4646]/15">
                <Icon name="alert" size={15} className="text-[#FF4646]" />
              </span>
              <p className="text-[13px] font-medium text-[#C73535]">{error}</p>
            </div>
          </Reveal>
        )}

        {!cart || cart.items.length === 0 ? (
          <Reveal direction="up">
            <CartEmptyState onShop={() => navigate('/categories')} />
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
            {/* ── Item list ── */}
            <Reveal direction="up" className="lg:col-span-2">
              <div
                className="
                  overflow-hidden rounded-[24px] border border-white/80
                  bg-white/95 shadow-[0_18px_50px_rgba(32,36,45,0.08)]
                  backdrop-blur-sm
                "
              >
                {/* Header list: select all + kosongkan */}
                <div
                  className="
                    flex items-center justify-between gap-3 border-b
                    border-[#E8ECF4] bg-[#F5F7FB]/60 px-4 py-3.5 sm:px-5
                  "
                >
                  <label className="flex cursor-pointer items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={allSelectable.length > 0 && selectedIds.size === allSelectable.length}
                      ref={(el) => {
                        if (el)
                          el.indeterminate =
                            selectedIds.size > 0 && selectedIds.size < allSelectable.length;
                      }}
                      onChange={(e) =>
                        setSelectedIds(e.target.checked ? new Set(allSelectable) : new Set())
                      }
                      className="h-4 w-4 cursor-pointer accent-[#538CDB]"
                    />
                    <span className="text-[13px] font-bold text-[#20242D]">
                      {selectedIds.size} dari {cart.items.length} item dipilih
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={handleClear}
                    disabled={busy}
                    className="
                      text-[11px] font-semibold text-[#FF4646]
                      hover:underline disabled:opacity-50
                    "
                  >
                    Kosongkan keranjang
                  </button>
                </div>

                {/* Items */}
                <div className="px-4 sm:px-5">
                  {cart.items.map((item, index) => (
                    <Reveal key={item.id} direction="up" delay={stagger(index, 40)}>
                      <CartItemRow
                        item={item}
                        unavailable={cart.unavailableItems.some(
                          (u) => u.cartItemId === item.id
                        )}
                        selected={selectedIds.has(item.id)}
                        busy={busy}
                        onToggleSelect={(checked) =>
                          setSelectedIds((prev) => {
                            const next = new Set(prev);
                            if (checked) next.add(item.id);
                            else next.delete(item.id);
                            return next;
                          })
                        }
                        onQty={(quantity) => handleQty(item.id, quantity)}
                        onRemove={() => handleRemove(item.id)}
                      />
                    </Reveal>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* ── Summary ─ */}
            <Reveal direction="up" delay={120}>
              <CartSummary
                subtotal={subtotal}
                selectedCount={selectedIds.size}
                budget={budget}
                pct={pct}
                budgetInput={budgetInput}
                onBudgetInputChange={setBudgetInput}
                onBudgetSave={handleBudget}
                onBudgetRemove={() => mutate(() => setCartBudget(null))}
                onCheckout={() =>
                  navigate('/checkout', { state: { cartItemIds: [...selectedIds] } })
                }
                onContinue={() => navigate('/categories')}
                busy={busy}
              />
            </Reveal>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;