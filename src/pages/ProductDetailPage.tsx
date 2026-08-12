// src/pages/ProductDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Icon from '../components/ui/Icon';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { formatRupiah } from '../utils/currency';
import { getProductBySlug, recordProductView } from '../api/products';
import { addToCart } from '../api/cart';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../hooks/useWishlist';
import type { ProductDetail } from '../types';

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { refreshCartCount } = useCart();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { saved: wishlisted, busy: wishlistBusy, error: wishlistError, toggle: toggleWishlist } = useWishlist(product?.id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getProductBySlug(slug)
      .then(setProduct)
      .catch((err) => setError(err.message ?? 'Gagal memuat produk'))
      .finally(() => setLoading(false));
  }, [slug]);

  // Catat kunjungan — ini yang mengisi card "Product Views" di dashboard
  // seller. Kegagalannya sengaja diabaikan: statistik tidak boleh membuat
  // halaman produk gagal tampil.
  useEffect(() => {
    if (!product?.id) return;
    recordProductView(product.id).catch(() => {});
  }, [product?.id]);

  const handleToggleWishlist = () => {
    if (!product) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    toggleWishlist();
  };

  const handleAddToCart = async () => {
    if (!product) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (adding) return;
    setAdding(true);
    setCartError(null);
    try {
      await addToCart(product.id, quantity);
      await refreshCartCount();
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err: any) {
      setCartError(err.message ?? 'Gagal menambahkan ke keranjang');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Navbar />
        <main className="flex-1 max-w-6xl mx-auto w-full px-5 sm:px-10 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 bg-gray-200 rounded" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-2xl" />
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-8 bg-gray-200 rounded w-1/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Navbar />
        <main className="flex-1 max-w-6xl mx-auto w-full px-5 sm:px-10 py-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error ?? 'Produk tidak ditemukan'}</p>
            <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">
              Kembali
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const primaryImage = product.images[selectedImage]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80';

  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-5 sm:px-10 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-[#737686] hover:text-[#191c1e] mb-6 transition-colors"
        >
          <Icon name="chevronLeft" size={16} className="" />
          <span className="text-[13px]">Kembali</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-[#f2f4f6] rounded-2xl overflow-hidden">
              <img
                src={primaryImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                      idx === selectedImage ? 'border-[#004ac6]' : 'border-transparent'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-[12px] text-[#004ac6] uppercase font-semibold">
                  {product.seller.storeName}
                </p>
                <button
                  onClick={() => navigate(`/messages?seller=${product.seller.id}`)}
                  className="inline-flex items-center gap-1 rounded-full bg-[#f2f4f6] px-2.5 py-1 text-[11px] font-semibold text-[#434655] hover:bg-[#dbe1ff] hover:text-[#004ac6] transition-colors"
                >
                  <Icon name="chat" size={12} /> Chat penjual
                </button>
              </div>
              <h1 className="text-[24px] font-bold text-[#191c1e] leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Rating & sold */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Icon name="star" size={16} className="text-[#ffb020]" />
                <span className="font-semibold">{product.rating}</span>
                <span className="text-[#737686]">({product.reviewCount} ulasan)</span>
              </div>
              <span className="text-[#737686]">|</span>
              <span className="text-[#737686]">{product.soldCount} terjual</span>
            </div>

            {/* Price */}
            <div className="bg-[#f2f4f6] rounded-xl p-4">
              <p className="text-[12px] text-[#737686] mb-1">
                Harga {quantity > 1 ? `${formatRupiah(product.price)} x ${quantity}` : ''}
              </p>
              <p className="text-[28px] font-bold text-[#004ac6]">
                {formatRupiah(Number(product.price) * quantity)}
              </p>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-[#737686]">Stok:</span>
              <span className={`text-[13px] font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {product.stock > 0 ? `${product.stock} tersedia` : 'Stok habis'}
              </span>
            </div>

            {/* Quantity */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-[13px] text-[#737686]">Jumlah:</span>
                <div className="flex items-center border border-[#c3c6d7] rounded-lg">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Icon name="minus" size={16} className="" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Icon name="plus" size={16} className="" />
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleToggleWishlist}
                disabled={wishlistBusy}
                className={`flex items-center gap-2 px-6 py-3 rounded-full border-2 transition-colors disabled:opacity-60 ${
                  wishlisted
                    ? 'border-[#004ac6] bg-[#004ac6] text-white'
                    : 'border-[#c3c6d7] hover:border-[#004ac6]'
                }`}
              >
                <Icon name="heart" size={20} className={`${wishlisted ? '' : ''}`} />
                <span>{wishlisted ? 'Wishlisted' : 'Wishlist'}</span>
              </button>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || adding}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#191c1e] hover:bg-[#004ac6] text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon name="cart" size={20} className="" />
                <span>{added ? 'Ditambahkan!' : adding ? 'Menambahkan...' : 'Tambah ke Keranjang'}</span>
              </button>
            </div>
            {cartError && (
              <p className="mt-3 text-[12px] text-red-600 bg-red-50 rounded-lg px-3 py-2">{cartError}</p>
            )}
            {wishlistError && (
              <p className="mt-3 text-[12px] text-red-600 bg-red-50 rounded-lg px-3 py-2">{wishlistError}</p>
            )}

            {/* Description */}
            {product.description && (
              <div className="pt-4 border-t border-[#e0e3e5]">
                <h3 className="text-[14px] font-bold text-[#191c1e] mb-2">Deskripsi</h3>
                <p className="text-[14px] text-[#434655] whitespace-pre-wrap">{product.description}</p>
              </div>
            )}

            {/* Attributes */}
            {product.attributes && product.attributes.length > 0 && (
              <div className="pt-4 border-t border-[#e0e3e5]">
                <h3 className="text-[14px] font-bold text-[#191c1e] mb-2">Spesifikasi</h3>
                <div className="space-y-2">
                  {product.attributes.map((attr) => (
                    <div key={attr.id} className="flex gap-4 text-[13px]">
                      <span className="text-[#737686] w-32 shrink-0">{attr.attrKey}</span>
                      <span className="text-[#191c1e]">{attr.attrValue}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
