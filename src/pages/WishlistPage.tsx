import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Icon from '../components/ui/Icon';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Reveal from '../components/ui/Reveal';

import WishlistLoginPrompt from '../components/wishlist/WishListLoginPrompt';
import WishlistEmptyState from '../components/wishlist/WishListEmptyState';
import WishlistItemCard from '../components/wishlist/WishListItemCard';

import { addToCart } from '../api/cart';
import { getAccessToken } from '../api/auth';
import { useCart as useCartContext } from '../contexts/CartContext';
import { useWishlistContext } from '../contexts/WishlistContext';

const stagger = (index: number, base = 60) => Math.min(index, 11) * base;

const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const { refreshCartCount } = useCartContext();
  const { items, loading: wishlistLoading, toggle } = useWishlistContext();

  const [loading, setLoading] = useState(wishlistLoading);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const isAuthed = !!getAccessToken();

  useEffect(() => {
    setLoading(wishlistLoading);
  }, [wishlistLoading]);

  const handleRemove = async (productId: string) => {
    setBusyId(productId);
    setError(null);
    try {
      await toggle(productId);
    } catch (err: any) {
      setError(err.message ?? 'Gagal hapus dari wishlist, coba lagi ya');
    } finally {
      setBusyId(null);
    }
  };

  const handleAddToCart = async (productId: string) => {
    setBusyId(productId);
    setError(null);
    try {
      await addToCart(productId, 1);
      await refreshCartCount();
    } catch (err: any) {
      setError(err.message ?? 'Gagal masukin ke keranjang, coba lagi ya');
    } finally {
      setBusyId(null);
    }
  };

  if (!isAuthed) return <WishlistLoginPrompt />;

  return (
    <div
      className="min-h-screen flex flex-col bg-[#f5f7fb]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-8 sm:px-8">

        <Reveal direction="up">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#538cbd]/10 px-2.5 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
                  <p className="text-[9px] font-bold uppercase tracking-[0.20em] text-[#4077a6]">
                    Produk simpanan
                  </p>
                </span>
              </div>

              <h1 className="text-[26px] font-extrabold leading-tight tracking-tight text-[#101319] sm:text-[32px]">
                Wishlist
              </h1>
              <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-[#737686]">
                {loading
                  ? 'Muat produk simpananmu...'
                  : `${items.length} produk tersimpan yang siap kamu checkout.`}
              </p>
            </div>

            <div
              className="
                hidden h-12 w-12 items-center justify-center rounded-2xl
                bg-gradient-to-br from-[#538cbd] to-[#284a67]
                shadow-[0_6px_16px_rgba(83,140,219,0.30)] sm:flex
              "
            >
              <Icon name="heart" size={22} className="text-white" />
            </div>
          </div>
        </Reveal>

        {error && (
          <Reveal direction="up">
            <div
              className="
                mb-5 flex items-center gap-3 rounded-2xl border
                border-[#ba1a1a]/20 bg-[#FFF0F0] px-4 py-3 backdrop-blur-sm
              "
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ba1a1a]/15">
                <Icon name="alert" size={15} className="text-[#ba1a1a]" />
              </span>
              <p className="text-[13px] font-medium text-[#ba1a1a]">{error}</p>
            </div>
          </Reveal>
        )}

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Reveal key={i} direction="up" delay={stagger(i)}>
                <div
                  className="
                    flex animate-pulse items-center gap-4 rounded-[20px]
                    border border-white/80 bg-white/95 p-4
                  "
                >
                  <div className="h-16 w-16 shrink-0 rounded-xl bg-[#F5F7FB] sm:h-20 sm:w-20" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 w-3/4 rounded-full bg-[#F5F7FB]" />
                    <div className="h-3 w-1/3 rounded-full bg-[#F5F7FB]" />
                    <div className="h-4 w-24 rounded-full bg-[#F5F7FB]" />
                  </div>
                  <div className="h-9 w-28 rounded-full bg-[#F5F7FB]" />
                </div>
              </Reveal>
            ))}
          </div>
        ) : items.length === 0 ? (
          <Reveal direction="up">
            <WishlistEmptyState onExplore={() => navigate('/categories')} />
          </Reveal>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <Reveal key={item.id} direction="up" delay={stagger(index)}>
                <WishlistItemCard
                  product={item.product}
                  busy={busyId === item.product.id}
                  onOpen={() => navigate(`/products/${item.product.slug}`)}
                  onAddToCart={() => handleAddToCart(item.product.id)}
                  onRemove={() => handleRemove(item.product.id)}
                />
              </Reveal>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default WishlistPage;