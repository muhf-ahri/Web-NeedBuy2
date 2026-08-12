// src/pages/WishlistPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/ui/Icon';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { formatRupiah } from '../utils/currency';
import { addToCart } from '../api/cart';
import { getAccessToken } from '../api/auth';
import { useCart as useCartContext } from '../contexts/CartContext';
import { useWishlistContext } from '../contexts/WishlistContext';

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

  if (!isAuthed) {
    return (
      <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Navbar />
        <main className="flex-1 max-w-6xl mx-auto w-full px-5 sm:px-10 py-16 flex items-center justify-center">
          <div className="text-center">
            <Icon name="lock" size={48} className="text-[#c3c6d7] mx-auto mb-4" />
            <p className="text-[#737686] mb-4">Login dulu ya buat lihat wishlist kamu.</p>
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

  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-5 sm:px-10 py-8">
        <h1 className="text-[28px] font-bold text-[#191c1e] mb-6">Wishlist</h1>

        {error && (
          <div className="bg-[#ffdad6] border border-[#ba1a1a]/20 rounded-2xl px-4 py-3 mb-4">
            <p className="text-[13px] text-[#93000a]">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-24 bg-[#f2f4f6] rounded-2xl" />
            <div className="h-24 bg-[#f2f4f6] rounded-2xl" />
            <div className="h-24 bg-[#f2f4f6] rounded-2xl" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <Icon name="heart" size={48} className="text-[#c3c6d7] mx-auto mb-4" />
            <p className="text-[#737686]">Wishlist kamu masih kosong nih.</p>
            <button
              onClick={() => navigate('/categories')}
              className="mt-4 px-6 py-2.5 rounded-full bg-[#004ac6] hover:bg-[#003ea8] text-white text-[14px] font-semibold transition-colors"
            >
              Jelajahi Produk
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-white border border-[#e0e3e5] rounded-2xl p-3 hover:border-[#004ac6] transition-colors"
              >
                <button onClick={() => navigate(`/products/${item.product.slug}`)} className="shrink-0">
                  <div className="w-16 h-16 rounded-xl bg-[#f2f4f6] overflow-hidden">
                    <img
                      src={item.product.images[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80'}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </button>
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => navigate(`/products/${item.product.slug}`)}
                >
                  <p className="text-[13px] font-semibold text-[#191c1e] truncate">{item.product.name}</p>
                  <p className="text-[12px] text-[#737686] mt-0.5">
                    {item.product.stock > 0 ? `${item.product.stock} tersedia` : 'Stok habis'}
                  </p>
                  <p className="text-[14px] font-bold text-[#004ac6] mt-1">{formatRupiah(item.product.price)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleAddToCart(item.product.id)}
                    disabled={busyId === item.product.id || item.product.stock <= 0}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#004ac6] hover:bg-[#003ea8] text-white text-[12px] font-semibold transition-colors disabled:opacity-50"
                  >
                    {busyId === item.product.id ? <Icon name="clock" size={14} className="animate-spin" /> : <Icon name="cart" size={14} className="" />}
                    Keranjang
                  </button>
                  <button
                    onClick={() => handleRemove(item.product.id)}
                    disabled={busyId === item.product.id}
                    className="p-2 rounded-full border border-[#e0e3e5] text-[#737686] hover:text-[#ba1a1a] hover:border-[#ba1a1a]/40 transition-colors disabled:opacity-50"
                    aria-label="Hapus dari wishlist"
                  >
                    <Icon name="trash" size={16} className="" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default WishlistPage;
