// src/pages/SearchPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Icon from '../components/ui/Icon';
import SearchSuggestions from '../components/ui/SearchSuggestions';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { formatRupiah } from '../utils/currency';
import { getProducts, type GetProductsParams } from '../api/products';
import { getSeller, searchSellers, type Seller } from '../api/sellers';
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

/** Logo toko, dengan inisial nama sebagai cadangan kalau tokonya belum punya logo. */
const StoreLogo: React.FC<{ store: Seller; size: number }> = ({ store, size }) => (
  <div
    className="shrink-0 overflow-hidden rounded-xl border border-[#e0e3e5] bg-[#dbe1ff] flex items-center justify-center"
    style={{ width: size, height: size }}
  >
    {store.logoUrl ? (
      <img src={store.logoUrl} alt="" className="h-full w-full object-cover" />
    ) : (
      <span className="font-bold text-[#004ac6]" style={{ fontSize: size / 2.6 }}>
        {store.storeName.charAt(0).toUpperCase()}
      </span>
    )}
  </div>
);

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshCartCount } = useCartContext();
  const initialQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(initialQuery);
  const [input, setInput] = useState(initialQuery);
  const qFromUrl = searchParams.get('q') ?? '';
  /** Diisi saat user mengklik sebuah toko di hasil pencarian. */
  const sellerFromUrl = searchParams.get('seller');

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
  const [stores, setStores] = useState<Seller[]>([]);
  const [openedStore, setOpenedStore] = useState<Seller | null>(null);
  const [storesError, setStoresError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { savedIds: wishlistIds, toggle: toggleWishlistContext } = useWishlistContext();

  const isAuthed = !!getAccessToken();

  const fetchResults = useCallback(async () => {
    // Mode "buka toko": produk dibatasi ke satu toko, kata kunci tidak dipakai.
    if (sellerFromUrl) {
      setLoading(true);
      setError(null);
      try {
        const params: GetProductsParams = { sellerId: sellerFromUrl, limit: 50, page: 1 };
        if (sort !== 'Relevansi') {
          const opt = SORT_OPTIONS.find((o) => o.label === sort);
          if (opt?.value) params.sort = opt.value;
        }
        const [productRes, sellerRes] = await Promise.all([
          getProducts(params),
          getSeller(sellerFromUrl),
        ]);
        setProducts(productRes.data);
        setOpenedStore(sellerRes.data.data);
        setStores([]);
        setStoresError(null);
      } catch (err: any) {
        setError(err.message ?? 'Gagal memuat produk toko');
      } finally {
        setLoading(false);
      }
      return;
    }

    setOpenedStore(null);

    if (!query.trim()) {
      setProducts([]);
      setStores([]);
      setStoresError(null);
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
      // Toko dicari lewat endpoint terpisah: pencarian produk hanya cocok ke
      // nama/deskripsi produk, jadi nama toko tidak akan pernah ketemu di sana.
      const [productRes, storeRes] = await Promise.allSettled([
        getProducts(params),
        searchSellers(query.trim(), 6),
      ]);

      if (productRes.status === 'fulfilled') {
        setProducts(productRes.value.data);
      } else {
        setProducts([]);
        setError(productRes.reason?.message ?? 'Gagal memuat hasil pencarian');
      }

      // Gagalnya pencarian toko tidak menjatuhkan hasil produk, TAPI juga tidak
      // ditelan diam-diam: versi sebelumnya memakai `.catch(() => [])`, sehingga
      // bagian Toko yang error terlihat persis sama dengan "tidak ada toko yang
      // cocok" — tidak mungkin dibedakan user maupun saat menelusuri masalah.
      if (storeRes.status === 'fulfilled') {
        setStores(storeRes.value.items);
        setStoresError(null);
      } else {
        setStores([]);
        setStoresError(storeRes.reason?.message ?? 'Gagal memuat daftar toko');
      }
    } catch (err: any) {
      setError(err.message ?? 'Gagal memuat hasil pencarian');
    } finally {
      setLoading(false);
    }
  }, [query, sort, sellerFromUrl]);

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
            placeholder="Cari produk atau toko..."
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

        {/* Header toko yang sedang dibuka */}
        {openedStore && (
          <div className="mb-6 flex items-start gap-4 rounded-2xl border border-[#e0e3e5] bg-[#f8f9fb] p-5">
            <StoreLogo store={openedStore} size={64} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-[18px] font-bold text-[#191c1e]">{openedStore.storeName}</h2>
                {openedStore.vacationMode && (
                  <span className="rounded-full bg-[#fff4e0] px-2 py-0.5 text-[11px] font-semibold text-[#b45309]">
                    Sedang libur
                  </span>
                )}
              </div>
              {openedStore.description && (
                <p className="mt-1 text-[13px] text-[#434655]">{openedStore.description}</p>
              )}
              <p className="mt-1.5 text-[12px] text-[#737686]">
                <Icon name="star" size={12} className="inline text-[#f59e0b]" />{' '}
                {Number(openedStore.rating).toFixed(1)} · {openedStore._count?.products ?? 0} produk
              </p>
            </div>
            <button
              onClick={() => navigate('/search')}
              className="shrink-0 text-[12px] text-[#004ac6] hover:underline"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Pencarian toko gagal — ditampilkan, bukan disembunyikan sebagai
            "tidak ada hasil". */}
        {!openedStore && !loading && storesError && (
          <div className="mb-6 rounded-2xl border border-[#ffe0b0] bg-[#fff4e0] px-4 py-3">
            <p className="text-[13px] text-[#b45309]">Pencarian toko gagal: {storesError}</p>
          </div>
        )}

        {/* Toko yang cocok dengan kata kunci */}
        {!openedStore && !loading && stores.length > 0 && (
          <section className="mb-7">
            <h2 className="mb-3 text-[13px] font-bold uppercase tracking-wide text-[#737686]">
              Toko ({stores.length})
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {stores.map((store) => (
                <button
                  key={store.id}
                  onClick={() => navigate(`/search?seller=${store.id}`)}
                  className="flex items-start gap-3 rounded-2xl border border-[#e0e3e5] bg-white p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <StoreLogo store={store} size={48} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="truncate text-[14px] font-semibold text-[#191c1e]">
                        {store.storeName}
                      </span>
                      {store.vacationMode && (
                        <span className="rounded-full bg-[#fff4e0] px-1.5 py-0.5 text-[10px] font-semibold text-[#b45309]">
                          Libur
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-[12px] text-[#737686]">
                      {store.description || 'Toko ini belum menulis deskripsi.'}
                    </p>
                    <p className="mt-1 text-[11px] text-[#737686]">
                      <Icon name="star" size={11} className="inline text-[#f59e0b]" />{' '}
                      {Number(store.rating).toFixed(1)} · {store._count?.products ?? 0} produk
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
          <p className="text-[13px] text-[#737686]">
            {openedStore
              ? loading
                ? 'Memuat produk toko...'
                : `${products.length} produk di toko ini`
              : query.trim()
                ? loading
                  ? 'Mencari...'
                  : `${products.length} produk untuk "${query}"`
                : 'Ketik kata kunci untuk mencari produk atau nama toko'}
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
        ) : openedStore && products.length === 0 ? (
          <div className="text-center py-20">
            <Icon name="product" size={48} className="text-[#c3c6d7] mx-auto mb-4" />
            <p className="text-[#737686]">Toko ini belum menayangkan produk apa pun.</p>
          </div>
        ) : query.trim() && products.length === 0 ? (
          <div className="text-center py-20">
            <Icon name="search" size={48} className="text-[#c3c6d7] mx-auto mb-4" />
            <p className="text-[#737686]">Tidak ada produk yang cocok dengan "{query}".</p>
            <p className="text-[12px] text-[#c3c6d7] mt-1">
              {stores.length > 0
                ? 'Tapi ada toko yang cocok — lihat di bagian Toko di atas.'
                : 'Coba kata kunci lain.'}
            </p>
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
