// src/pages/ProductDetailPage.tsx
//
// Dua kolom: kiri seputar produknya (galeri, judul, rating/terjual, harga,
// pilihan model, profil toko, ulasan pembeli), kanan kartu pembelian yang
// menempel (penawaran grosir, jumlah, harga, tombol beli).
import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Icon from '../components/ui/Icon';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ProductReviews from '../components/ProductReviews';
import SellerCard from '../components/SellerCard';
import ReportButton from '../components/ui/ReportButton';
import { formatRupiah } from '../utils/currency';
import { getProductBySlug, recordProductView } from '../api/products';
import { addToCart } from '../api/cart';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../hooks/useWishlist';
import type { ProductDetail } from '../types';

/** Harga sebelum diskon promo, dihitung balik dari harga jual. */
const strikePrice = (price: string, discountPercent: number): number =>
  Math.round(Number(price) / (1 - discountPercent / 100));

/**
 * Spesifikasi dikelompokkan per nama. Nama yang punya lebih dari satu nilai
 * jadi pilihan model — itulah satu-satunya definisi "varian" di proyek ini,
 * karena varian berasal dari product_attributes, bukan tabel varian bersstok.
 */
function groupSpecs(attributes: ProductDetail['attributes']) {
  const groups = new Map<string, string[]>();
  for (const attribute of attributes ?? []) {
    const values = groups.get(attribute.attrKey) ?? [];
    if (!values.includes(attribute.attrValue)) values.push(attribute.attrValue);
    groups.set(attribute.attrKey, values);
  }
  const options = [...groups.entries()].filter(([, values]) => values.length > 1);
  const facts = [...groups.entries()].filter(([, values]) => values.length === 1);
  return { options, facts };
}

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { refreshCartCount } = useCart();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {
    saved: wishlisted,
    busy: wishlistBusy,
    error: wishlistError,
    toggle: toggleWishlist,
  } = useWishlist(product?.id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);
  const [shareNote, setShareNote] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getProductBySlug(slug)
      .then((data) => {
        setProduct(data);
        // Model pertama dipilih otomatis: tombol beli tidak boleh mengirim
        // pilihan kosong untuk produk yang jelas punya beberapa model.
        const { options } = groupSpecs(data.attributes);
        setPicked(Object.fromEntries(options.map(([key, values]) => [key, values[0]])));
      })
      .catch((err) => setError(err.message ?? 'Gagal muat produk, coba lagi ya'))
      .finally(() => setLoading(false));
  }, [slug]);

  // Catat kunjungan — ini yang mengisi card "Produk Dilihat" di dashboard
  // penjual. Kegagalannya sengaja diabaikan: statistik tidak boleh membuat
  // halaman produk gagal tampil.
  useEffect(() => {
    if (!product?.id) return;
    recordProductView(product.id).catch(() => {});
  }, [product?.id]);

  const { options, facts } = useMemo(() => groupSpecs(product?.attributes ?? []), [product]);

  /** Teks varian yang dikirim ke server, mis. "warna: Hitam · ukuran: L". */
  const variantLabel = useMemo(
    () =>
      Object.entries(picked)
        .map(([key, value]) => `${key}: ${value}`)
        .join(' · ') || null,
    [picked]
  );

  const unitPrice = Number(product?.price ?? 0);
  const bulkReady =
    product?.bulkMinQty != null &&
    product?.bulkDiscountPercent != null &&
    quantity >= product.bulkMinQty;
  const bulkPercent = bulkReady ? (product?.bulkDiscountPercent ?? 0) : 0;
  const gross = unitPrice * quantity;
  // Rumus yang sama dengan lib/bulkPrice.ts di server: potong di TOTAL, lalu
  // bulatkan. Kalau dihitung dari harga satuan yang dibulatkan dulu, angka di
  // halaman ini bisa beda beberapa rupiah dari yang ditagih checkout.
  // ponytail: rumusnya ditulis dua kali (di sini dan di server) supaya halaman
  // produk tidak perlu satu request lagi cuma buat menghitung harga. Kalau
  // aturan grosirnya jadi lebih rumit (tier bertingkat), pindahkan ke endpoint
  // penghitung harga dan hapus salinan ini.
  const payable = bulkPercent > 0 ? Math.round((gross * (100 - bulkPercent)) / 100) : gross;

  const requireLogin = () => {
    if (isAuthenticated) return false;
    navigate('/login');
    return true;
  };

  const handleAddToCart = async (thenCheckout = false) => {
    if (!product || adding) return;
    if (requireLogin()) return;
    setAdding(true);
    setCartError(null);
    try {
      await addToCart(product.id, quantity, variantLabel);
      await refreshCartCount();
      if (thenCheckout) {
        navigate('/checkout');
        return;
      }
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err: any) {
      setCartError(err.message ?? 'Gagal masukin ke keranjang, coba lagi ya');
    } finally {
      setAdding(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product?.name, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareNote('Link produk udah dikopi.');
      setTimeout(() => setShareNote(null), 2000);
    } catch {
      // Batal share atau clipboard ditolak browser — bukan kegagalan yang
      // perlu ditampilkan, user memang bisa membatalkan sendiri.
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex flex-col bg-white"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <Navbar />
        <main className="flex-1 max-w-6xl mx-auto w-full px-5 sm:px-10 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
            <div className="lg:col-span-2 space-y-4">
              <div className="aspect-[4/3] bg-[#f2f4f6] rounded-3xl" />
              <div className="h-7 w-2/3 bg-[#f2f4f6] rounded" />
              <div className="h-20 bg-[#f2f4f6] rounded-2xl" />
            </div>
            <div className="h-80 bg-[#f2f4f6] rounded-3xl" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div
        className="min-h-screen flex flex-col bg-white"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <Navbar />
        <main className="flex-1 max-w-6xl mx-auto w-full px-5 sm:px-10 py-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-[#93000a] mb-4">{error ?? 'Produknya nggak ketemu'}</p>
            <button onClick={() => navigate(-1)} className="text-[#004ac6] hover:underline">
              Balik
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const onSale = product.discountPercent > 0;
  const images = product.images ?? [];
  const heroImage = images[selectedImage]?.url ?? images[0]?.url ?? null;

  return (
    <div
      className="min-h-screen flex flex-col bg-white"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-5 sm:px-10 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-[#737686] hover:text-[#191c1e] mb-6 transition-colors"
        >
          <Icon name="chevronLeft" size={16} className="" />
          <span className="text-[13px]">Balik</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Kolom kiri: seputar produk ─────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Galeri */}
            <div className="space-y-3">
              <div className="relative aspect-[4/3] bg-[#f2f4f6] rounded-3xl overflow-hidden">
                {heroImage ? (
                  <img src={heroImage} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[#a6a9b6]">
                    <Icon name="product" size={40} className="" />
                    <span className="text-[12px]">Penjual belum menambahkan foto</span>
                  </div>
                )}

                {onSale && (
                  <span className="absolute top-4 left-4 rounded-full bg-[#ff5a1f] px-3 py-1 text-[12px] font-bold text-white shadow-lg">
                    -{product.discountPercent}%
                  </span>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {images.map((image, index) => (
                    <button
                      key={image.url}
                      onClick={() => setSelectedImage(index)}
                      aria-label={`Foto ${index + 1}`}
                      aria-current={index === selectedImage}
                      className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                        index === selectedImage ? 'border-[#004ac6]' : 'border-transparent'
                      }`}
                    >
                      <img src={image.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Judul + rating + terjual */}
            <div>
              <p className="text-[12px] uppercase tracking-wider text-[#737686]">
                {product.category?.name}
              </p>
              <div className="mt-1 flex items-start justify-between gap-3">
                <h1 className="text-[26px] sm:text-[30px] font-bold leading-tight text-[#191c1e]">
                  {product.name}
                </h1>
                <ReportButton
                  targetType="PRODUCT"
                  targetId={product.id}
                  targetLabel={product.name}
                  className="mt-2 shrink-0"
                />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]">
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="star" size={16} className="text-[#f59e0b]" />
                  <span className="font-bold text-[#191c1e]">{Number(product.rating).toFixed(1)}</span>
                  <span className="text-[#737686]">({product.reviewCount ?? 0} ulasan)</span>
                </span>
                <span className="text-[#c3c6d7]">|</span>
                <span className="text-[#434655]">
                  <span className="font-bold text-[#191c1e]">
                    {product.soldCount.toLocaleString('id-ID')}
                  </span>{' '}
                  terjual
                </span>
                <span className="text-[#c3c6d7]">|</span>
                <span className={product.stock > 0 ? 'text-[#156b32]' : 'text-[#ba1a1a]'}>
                  {product.stock > 0 ? `Stok ${product.stock}` : 'Stok habis'}
                </span>
              </div>
            </div>

            {/*
              Harga. Kalau ada diskon, angkanya dinaikkan di atas panel gelap
              dengan bayangan berlapis — satu-satunya elemen "3D" di halaman ini,
              supaya potongannya jadi hal pertama yang terlihat dan tidak
              bersaing dengan hiasan lain.
            */}
            {onSale ? (
              <div className="relative overflow-hidden rounded-3xl bg-[#191c1e] p-6 text-white">
                <div
                  className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#ff5a1f]/30 blur-2xl"
                  aria-hidden="true"
                />
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#ff9b6a]">
                  Harga promo
                </p>
                <div className="mt-2 flex flex-wrap items-end gap-4">
                  <span
                    className="text-[40px] sm:text-[52px] font-bold leading-none tracking-tight"
                    style={{ textShadow: '0 1px 0 #b23c14, 0 3px 0 #8d2f10, 0 8px 24px rgba(0,0,0,.45)' }}
                  >
                    {formatRupiah(product.price)}
                  </span>
                  <span className="pb-2 text-[16px] text-white/50 line-through">
                    {formatRupiah(strikePrice(product.price, product.discountPercent))}
                  </span>
                  <span className="mb-2 rounded-full bg-[#ff5a1f] px-3 py-1 text-[12px] font-bold shadow-[0_4px_0_#b23c14]">
                    Hemat {product.discountPercent}%
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-[#e0e3e5] p-6">
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#737686]">
                  Harga
                </p>
                <p className="mt-1 text-[36px] font-bold leading-none text-[#191c1e]">
                  {formatRupiah(product.price)}
                </p>
              </div>
            )}

            {/* Pilih model — hanya muncul kalau produknya memang punya pilihan */}
            {options.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-[15px] font-bold text-[#191c1e]">Pilih model</h2>
                {options.map(([key, values]) => (
                  <div key={key}>
                    <p className="mb-2 text-[12px] text-[#737686]">
                      {key}: <span className="font-semibold text-[#191c1e]">{picked[key]}</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {values.map((value) => {
                        const active = picked[key] === value;
                        return (
                          <button
                            key={value}
                            onClick={() => setPicked((prev) => ({ ...prev, [key]: value }))}
                            aria-pressed={active}
                            className={`rounded-full border px-4 py-2 text-[13px] font-medium transition-colors ${
                              active
                                ? 'border-[#004ac6] bg-[#dbe1ff] text-[#004ac6]'
                                : 'border-[#c3c6d7] text-[#434655] hover:border-[#004ac6]'
                            }`}
                          >
                            {value}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Profil penjual */}
            <SellerCard seller={product.seller} />
            <div className="-mt-2 flex justify-end">
              <ReportButton
                targetType="SELLER"
                targetId={product.seller.id}
                targetLabel={product.seller.storeName}
              />
            </div>

            {/* Deskripsi */}
            {product.description && (
              <div className="border-t border-[#e0e3e5] pt-6">
                <h2 className="mb-2 text-[15px] font-bold text-[#191c1e]">Deskripsi</h2>
                <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-[#434655]">
                  {product.description}
                </p>
              </div>
            )}

            {/* Spesifikasi tetap (nilai tunggal) */}
            {facts.length > 0 && (
              <div className="border-t border-[#e0e3e5] pt-6">
                <h2 className="mb-3 text-[15px] font-bold text-[#191c1e]">Spesifikasi</h2>
                <dl className="divide-y divide-[#f2f4f6]">
                  {facts.map(([key, values]) => (
                    <div key={key} className="flex gap-4 py-2 text-[13px]">
                      <dt className="w-32 shrink-0 text-[#737686]">{key}</dt>
                      <dd className="text-[#191c1e]">{values[0]}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Ulasan pembeli: bintang, sebaran, foto/video */}
            <div className="border-t border-[#e0e3e5] pt-6">
              <ProductReviews productId={product.id} />
            </div>
          </div>

          {/* ── Kolom kanan: kartu pembelian ───────────────────────────────── */}
          <aside className="lg:sticky lg:top-24 h-fit space-y-3">
            <div className="rounded-3xl border border-[#e0e3e5] p-5 shadow-sm">
              {/* Penawaran grosir */}
              {product.bulkMinQty != null && product.bulkDiscountPercent != null && (
                <div
                  className={`mb-4 rounded-2xl p-4 transition-colors ${
                    bulkReady ? 'bg-[#d7f5dc]' : 'bg-[#f2f4f6]'
                  }`}
                >
                  <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#156b32]">
                    <Icon name="tag" size={12} className="text-[#156b32]" />
                    Diskon grosir
                  </p>
                  <p className="mt-1 text-[13px] text-[#191c1e]">
                    Beli minimal{' '}
                    <span className="font-bold">{product.bulkMinQty} pcs</span>, potongan{' '}
                    <span className="font-bold">{product.bulkDiscountPercent}%</span>.
                  </p>
                  <p className="mt-1 text-[12px] text-[#434655]">
                    {bulkReady ? (
                      <>
                        Kepake — kamu hemat{' '}
                        <span className="font-bold text-[#156b32]">
                          {formatRupiah(gross - payable)}
                        </span>
                        .
                      </>
                    ) : (
                      <>
                        Tambah {(product.bulkMinQty ?? 0) - quantity} lagi buat dapetin potongannya.
                      </>
                    )}
                  </p>
                </div>
              )}

              {/* Jumlah */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-[13px] text-[#737686]">Jumlah</span>
                <div className="flex items-center rounded-full border border-[#c3c6d7]">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label="Kurangi jumlah"
                    className="flex h-10 w-10 items-center justify-center rounded-l-full transition-colors hover:bg-[#f2f4f6] disabled:opacity-40"
                  >
                    <Icon name="minus" size={16} className="" />
                  </button>
                  <span className="w-12 text-center text-[14px] font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(Math.max(product.stock, 1), q + 1))}
                    disabled={quantity >= product.stock}
                    aria-label="Tambah jumlah"
                    className="flex h-10 w-10 items-center justify-center rounded-r-full transition-colors hover:bg-[#f2f4f6] disabled:opacity-40"
                  >
                    <Icon name="plus" size={16} className="" />
                  </button>
                </div>
              </div>
              <p className="mt-1 text-right text-[11px] text-[#737686]">
                Sisa stok {product.stock}
              </p>

              {/* Total */}
              <div className="mt-4 border-t border-[#e0e3e5] pt-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-[13px] text-[#737686]">Total</span>
                  <span className="text-[26px] font-bold text-[#004ac6]">
                    {formatRupiah(payable)}
                  </span>
                </div>
                {payable !== gross && (
                  <div className="flex items-baseline justify-between text-[12px]">
                    <span className="text-[#737686]">Harga normal</span>
                    <span className="text-[#737686] line-through">{formatRupiah(gross)}</span>
                  </div>
                )}
                {variantLabel && (
                  <p className="mt-2 text-[11px] text-[#737686]">Model: {variantLabel}</p>
                )}
              </div>

              {/* Aksi utama */}
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => handleAddToCart(false)}
                  disabled={product.stock === 0 || adding}
                  className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#004ac6] px-6 py-3 text-[14px] font-semibold text-[#004ac6] transition-colors hover:bg-[#dbe1ff] disabled:opacity-50"
                >
                  <Icon name="cart" size={18} className="" />
                  {added ? 'Masuk keranjang!' : adding ? 'Bentar ya...' : 'Masukin Keranjang'}
                </button>
                <button
                  onClick={() => handleAddToCart(true)}
                  disabled={product.stock === 0 || adding}
                  className="w-full rounded-full bg-[#004ac6] px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#003ea8] disabled:opacity-50"
                >
                  Beli Langsung
                </button>
              </div>

              {/* Chat | Wishlist | Share */}
              <div className="mt-4 grid grid-cols-3 divide-x divide-[#e0e3e5] border-t border-[#e0e3e5] pt-3 text-[12px]">
                <button
                  onClick={() => navigate(`/messages?seller=${product.seller.id}`)}
                  className="flex flex-col items-center gap-1 py-1 text-[#434655] transition-colors hover:text-[#004ac6]"
                >
                  <Icon name="chat" size={18} className="" />
                  Chat
                </button>
                <button
                  onClick={() => {
                    if (requireLogin()) return;
                    toggleWishlist();
                  }}
                  disabled={wishlistBusy}
                  className={`flex flex-col items-center gap-1 py-1 transition-colors disabled:opacity-60 ${
                    wishlisted ? 'text-[#ba1a1a]' : 'text-[#434655] hover:text-[#004ac6]'
                  }`}
                >
                  <Icon name="heart" size={18} className="" />
                  {wishlisted ? 'Tersimpan' : 'Wishlist'}
                </button>
                <button
                  onClick={handleShare}
                  className="flex flex-col items-center gap-1 py-1 text-[#434655] transition-colors hover:text-[#004ac6]"
                >
                  <Icon name="send" size={18} className="" />
                  Share
                </button>
              </div>

              {(cartError || wishlistError || shareNote) && (
                <p
                  className={`mt-3 rounded-lg px-3 py-2 text-[12px] ${
                    cartError || wishlistError
                      ? 'bg-[#ffe0e0] text-[#a33131]'
                      : 'bg-[#d7f5dc] text-[#156b32]'
                  }`}
                >
                  {cartError ?? wishlistError ?? shareNote}
                </p>
              )}
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
