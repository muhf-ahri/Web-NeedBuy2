// src/pages/SearchPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Icon from '../components/ui/Icon';
import SearchSuggestions from '../components/ui/SearchSuggestions';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { formatRupiah } from '../utils/currency';
import { getProducts, type GetProductsParams } from '../api/products';
import type { Product } from '../types';
import { getAccessToken } from '../api/auth';
import { useCart as useCartContext } from '../contexts/CartContext';
import { useWishlistContext } from '../contexts/WishlistContext';
import { addToCart } from '../api/cart';

const SORT_OPTIONS = [
  { label: 'Relevansi', value: undefined },
  { label: 'Harga: Rendah ke Tinggi', value: 'price_asc' },
  { label: 'Harga: Tinggi ke Rendah', value: 'price_desc' },
  { label: 'Terbaru', value: 'newest' },
  { label: 'Rating Tertinggi', value: 'rating' },
  { label: 'Terlaris', value: 'sold' },
] as const;

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshCartCount } = useCartContext();
  const initialQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(initialQuery);
  const [input, setInput] = useState(initialQuery);
  const qFromUrl = searchParams.get('q') ?? '';

  // Sinkronkan state dengan URL. handleSubmit hanya navigate, dan komponen ini
  // tidak di-remount saat search param berubah — tanpa efek ini, pencarian ulang
  // dari halaman ini (atau Navbar) tidak pernah memicu fetch ulang.
  useEffect(() => {
    setQuery(qFromUrl);
    setInput(qFromUrl);
  }, [qFromUrl]);
  const [sort, setSort] = useState<string>('Relevansi');
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { savedIds: wishlistIds, toggle: toggleWishlistContext } = useWishlistContext();

  const isAuthed = !!getAccessToken();

  const fetchResults = useCallback(async () => {
    if (!query.trim()) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const params: GetProductsParams = {
        q: query.trim(),
        limit: 50,
        page: 1,
      };
      if (sort !== 'Relevansi') {
        const opt = SORT_OPTIONS.find((o) => o.label === sort);
        if (opt?.value) params.sort = opt.value;
      }
      const res = await getProducts(params);
      setProducts(res.data);
    } catch (err: any) {
      setError(err.message ?? 'Gagal memuat hasil pencarian');
    } finally {
      setLoading(false);
    }
  }, [query, sort]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuggestOpen(false);
    navigate(`/search?q=${encodeURIComponent(input.trim())}`);
  };

  const toggleWishlist = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    if (!isAuthed) {
      navigate('/login');
      return;
    }
    try {
      await toggleWishlistContext(productId);
    } catch (err: any) {
      setError(err.message ?? 'Gagal memperbarui wishlist');
    }
  };

  const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    if (!isAuthed) {
      navigate('/login');
      return;
    }
    try {
      await addToCart(productId, 1);
      await refreshCartCount();
    } catch (err: any) {
      setError(err.message ?? 'Gagal menambahkan ke keranjang');
    }
  };

  const primaryImage = (p: Product) =>
    p.images.find((img) => img.isPrimary)?.url ||
    p.images[0]?.url ||
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80';

  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-5 sm:px-10 py-8">
        <h1 className="text-[28px] font-bold text-[#191c1e] mb-4">Hasil Pencarian</h1>

        <form onSubmit={handleSubmit} className="relative mb-6">
          <Icon name="search" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737686]" />
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setSuggestOpen(true);
            }}
            onFocus={() => setSuggestOpen(true)}
            onBlur={() => setSuggestOpen(false)}
            onKeyDown={(e) => { if (e.key === 'Escape') setSuggestOpen(false); }}
            placeholder="Cari produk..."
            className="w-full pl-12 pr-12 py-3 bg-[#f2f4f6] rounded-full text-sm outline-none focus:ring-2 focus:ring-[#004ac6]/20 focus:bg-white border border-transparent focus:border-[#004ac6] transition"
          />
          {input && (
            <button
              type="button"
              onClick={() => { setInput(''); setQuery(''); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737686] hover:text-[#191c1e]"
            >
              <Icon name="close" size={16} className="" />
            </button>
          )}

          {suggestOpen && (
            <SearchSuggestions term={input} onPick={() => setSuggestOpen(false)} />
          )}
        </form>

        {error && (
          <div className="bg-[#ffdad6] border border-[#ba1a1a]/20 rounded-2xl px-4 py-3 mb-4">
            <p className="text-[13px] text-[#93000a]">{error}</p>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
          <p className="text-[13px] text-[#737686]">
            {query.trim()
              ? loading
                ? 'Mencari...'
                : `${products.length} produk untuk "${query}"`
              : 'Ketik kata kunci untuk mencari produk'}
          </p>
          <div className="relative shrink-0">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none bg-white border border-[#c3c6d7] rounded-full pl-3 pr-8 py-1.5 text-[13px] text-[#191c1e] outline-none focus:border-[#004ac6] cursor-pointer transition-colors"
            >
              {SORT_OPTIONS.map((opt) => <option key={opt.label}>{opt.label}</option>)}
            </select>
            <Icon name="chevronDown" size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#737686]" />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#e0e3e5] overflow-hidden animate-pulse">
                <div className="aspect-4/3 bg-[#f2f4f6]" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-[#f2f4f6] rounded w-20" />
                  <div className="h-5 bg-[#f2f4f6] rounded" />
                  <div className="h-6 bg-[#f2f4f6] rounded w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : query.trim() && products.length === 0 ? (
          <div className="text-center py-20">
            <Icon name="search" size={48} className="text-[#c3c6d7] mx-auto mb-4" />
            <p className="text-[#737686]">Tidak ada produk yang cocok dengan "{query}".</p>
            <p className="text-[12px] text-[#c3c6d7] mt-1">Coba kata kunci lain.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {products.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/products/${p.slug}`)}
                className="group bg-white rounded-2xl border border-[#e0e3e5] overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col cursor-pointer"
              >
                <div className="relative aspect-4/3 bg-[#f2f4f6] overflow-hidden">
                  <img
                    src={primaryImage(p)}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <button
                    onClick={(e) => toggleWishlist(e, p.id)}
                    className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                    aria-label="Toggle wishlist"
                  >
                    <Icon name="heart" size={14} className={`transition-colors ${wishlistIds.has(p.id) ? 'text-[#004ac6]' : 'text-[#737686]'}`} />
                  </button>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <span className="text-[11px] font-semibold text-[#004ac6] uppercase tracking-wide mb-1">
                    {p.seller.storeName}
                  </span>
                  <h3 className="text-[14px] font-semibold text-[#191c1e] leading-snug line-clamp-2 flex-1">
                    {p.name}
                  </h3>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[15px] font-bold text-[#004ac6]">{formatRupiah(p.price)}</span>
                    <button
                      onClick={(e) => handleAddToCart(e, p.id)}
                      className="w-8 h-8 rounded-full bg-[#191c1e] hover:bg-[#004ac6] text-white flex items-center justify-center transition-colors duration-200"
                      aria-label="Tambah ke keranjang"
                    >
                      <Icon name="cart" size={14} className="" />
                    </button>
                  </div>
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

export default SearchPage;
