// src/components/layout/SaleRail.tsx
//
// Rail promo yang jalan sendiri. Track digandakan dua kali lalu digeser -50%
// oleh CSS (`.nb-marquee`) — loop mulus tanpa timer JS, dan otomatis berhenti
// saat di-hover, di-fokus keyboard, atau saat user minta reduced motion.
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../ui/Icon';
import { formatRupiah } from '../../utils/currency';
import { getProducts } from '../../api/products';
import type { Product } from '../../types';

/** Harga sebelum diskon, dihitung balik dari harga jual. */
const strikePrice = (price: string, discountPercent: number): number =>
  Math.round(Number(price) / (1 - discountPercent / 100));

const SaleCard: React.FC<{ product: Product }> = ({ product }) => {
  const image = product.images?.[0]?.url;
  const onSale = product.discountPercent > 0;

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group flex w-[320px] shrink-0 gap-4 rounded-2xl border border-[#e0e3e5] bg-white p-3 transition-colors hover:border-[#004ac6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004ac6]"
    >
      <div className="relative w-24 h-24 shrink-0 rounded-xl bg-[#f2f4f6] overflow-hidden">
        {image ? (
          <img src={image} alt="" loading="lazy" className="w-full h-full object-cover" />
        ) : (
          <span className="w-full h-full flex items-center justify-center text-[#c3c6d7]">
            <Icon name="orders" size={24} />
          </span>
        )}
        {onSale && (
          <span className="absolute top-1 left-1 rounded-full bg-[#ff5a1f] px-2 py-0.5 text-[10px] font-bold text-white">
            -{product.discountPercent}%
          </span>
        )}
      </div>

      <div className="min-w-0 flex flex-col justify-center">
        <p className="text-[10px] uppercase tracking-wider text-[#737686]">
          {product.category?.name}
        </p>
        <h3 className="text-[13px] font-semibold text-[#101319] line-clamp-2 group-hover:text-[#004ac6] transition-colors">
          {product.name}
        </h3>
        <p className="mt-1 text-[15px] font-bold text-[#101319]">{formatRupiah(product.price)}</p>
        {onSale && (
          <p className="text-[11px] text-[#737686] line-through">
            {formatRupiah(strikePrice(product.price, product.discountPercent))}
          </p>
        )}
      </div>
    </Link>
  );
};

const SaleRail: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const sale = await getProducts({ onSale: true, limit: 12, sort: 'sold' });
        // Belum ada produk promo? Rail tetap berguna sebagai "paling laris",
        // dan tidak ada diskon palsu yang ditampilkan.
        const items =
          sale.data.length > 0 ? sale.data : (await getProducts({ limit: 12, sort: 'sold' })).data;
        if (!cancelled) setProducts(items);
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex gap-4 overflow-hidden px-5 sm:px-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-[120px] w-[320px] shrink-0 animate-pulse rounded-2xl bg-[#f2f4f6]" />
        ))}
      </div>
    );
  }

  if (products.length === 0) return null;

  const hasSale = products.some((product) => product.discountPercent > 0);
  // Durasi ikut jumlah kartu supaya kecepatan geser terasa sama, banyak atau sedikit.
  const duration = `${products.length * 6}s`;

  return (
    <section className="py-4" aria-label={hasSale ? 'Produk sedang diskon' : 'Produk paling laris'}>
      <div className="max-w-6xl mx-auto px-5 sm:px-10 mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-1.5 rounded-full bg-[#fff0e9] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#ff5a1f]">
            <Icon name="tag" size={12} />
            {hasSale ? 'Sedang diskon' : 'Paling laris'}
          </p>
          <h2 className="mt-2 text-2xl font-bold text-[#101319]">
            {hasSale ? 'Turun harga minggu ini' : 'Paling sering dibeli'}
          </h2>
        </div>
        <Link
          to="/categories"
          className="shrink-0 text-[13px] text-[#434655] hover:text-[#004ac6] transition-colors"
        >
          Lihat semua
        </Link>
      </div>

      {/* Mask di kedua sisi supaya kartu masuk-keluar tanpa terpotong keras */}
      <div
        className="relative overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
        }}
      >
        <div
          className="nb-marquee flex w-max"
          style={{ ['--nb-marquee-duration' as string]: duration }}
        >
          <div className="flex gap-4 pr-4">
            {products.map((product) => (
              <SaleCard key={product.id} product={product} />
            ))}
          </div>
          {/* Salinan kedua hanya untuk kemulusan loop — disembunyikan dari
              screen reader dan tab order supaya tidak terbaca dua kali. */}
          <div className="flex gap-4 pr-4" aria-hidden="true" inert>
            {products.map((product) => (
              <SaleCard key={`dup-${product.id}`} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SaleRail;
