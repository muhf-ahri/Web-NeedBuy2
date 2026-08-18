import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Icon from '../ui/Icon';
import { formatRupiah } from '../../utils/currency';

interface TopProduct {
  productId: string;
  productName: string;
  slug?: string;
  quantitySold: number;
  revenue: string | number;
  rank: number;
}

interface TopProductsCardProps {
  loading: boolean;
  error: string | null;
  products: TopProduct[];
}

const TopProductsCard: React.FC<TopProductsCardProps> = ({
  loading,
  error,
  products,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (loading || error || products.length === 0) return;
    const t = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(t);
  }, [loading, error, products]);

  const maxQuantity = Math.max(...products.map((p) => p.quantitySold), 1);

  return (
    <div
      className="
        relative overflow-hidden rounded-[24px] border border-white/80
        bg-white/95 p-5 shadow-[0_8px_24px_rgba(32,36,45,0.06)]
        backdrop-blur-sm sm:p-6
      "
    >

      <span
        className="
          pointer-events-none absolute -right-10 -top-10 h-24 w-24
          rounded-full border border-[#FFD500]/20
        "
      />
      <span
        className="
          pointer-events-none absolute right-4 top-4 h-1.5 w-1.5
          rounded-full bg-[#FFD500]
        "
      />

      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF7E0]">
          <Icon name="star" size={15} className="text-[#B45309]" />
        </span>
        <div>
          <h3 className="text-[14px] font-bold text-[#20242D] sm:text-[15px]">
            Produk Paling Laris
          </h3>
          <p className="text-[10px] text-[#737A87]">Top {products.length} produk</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 animate-pulse rounded-full bg-[#F5F7FB]" />
                <div className="h-3 w-40 animate-pulse rounded-full bg-[#F5F7FB]" />
              </div>
              <div className="h-2 w-full animate-pulse rounded-full bg-[#F5F7FB]" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-[#FF4646]/20 bg-[#FFF0F0] px-3 py-2 text-[12px] font-medium text-[#C73535]">
          {error}
        </div>
      ) : products.length === 0 ? (
        <div className="flex items-center gap-3 rounded-xl bg-[#F5F7FB] px-4 py-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
            <Icon name="product" size={16} className="text-[#A2A8B3]" />
          </span>
          <div>
            <p className="text-[13px] font-semibold text-[#20242D]">
              Belum ada penjualan
            </p>
            <p className="text-[11px] text-[#737A87]">
              Produk laris akan muncul setelah ada transaksi.
            </p>
          </div>
        </div>
      ) : (
        <ul className="space-y-3">
          {products.map((product, index) => {
            const widthPct = (product.quantitySold / maxQuantity) * 100;

            return (
              <li key={product.productId} className="group">
                <div className="mb-1 flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">

                    <span
                      className={`
                        flex h-5 w-5 shrink-0 items-center justify-center
                        rounded-full text-[10px] font-extrabold
                        ${
                          index === 0
                            ? 'bg-gradient-to-br from-[#FFD500] to-[#F59E0B] text-white shadow-[0_2px_6px_rgba(245,158,11,0.40)]'
                            : index === 1
                              ? 'bg-gradient-to-br from-[#D8DEE9] to-[#A2A8B3] text-white'
                              : index === 2
                                ? 'bg-gradient-to-br from-[#E6A87A] to-[#B45309] text-white'
                                : 'bg-[#F5F7FB] text-[#737A87]'
                        }
                      `}
                    >
                      {product.rank}
                    </span>

                    {product.slug ? (
                      <Link
                        to={`/products/${product.slug}`}
                        className="
                          truncate text-[12px] font-semibold text-[#20242D]
                          transition-colors hover:text-[#538CDB]
                          sm:text-[13px]
                        "
                      >
                        {product.productName}
                      </Link>
                    ) : (
                      <span className="truncate text-[12px] font-semibold text-[#20242D] sm:text-[13px]">
                        {product.productName}
                      </span>
                    )}
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-[12px] font-bold text-[#20242D] tabular-nums sm:text-[13px]">
                      {product.quantitySold} terjual
                    </p>
                    <p className="text-[10px] font-semibold text-[#538CDB] tabular-nums">
                      {formatRupiah(Number(product.revenue))}
                    </p>
                  </div>
                </div>

                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#F5F7FB]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#5B93E0] to-[#3A66AC]"
                    style={{
                      width: mounted ? `${widthPct}%` : '0%',
                      transition: `width 0.9s cubic-bezier(0.22, 0.9, 0.35, 1) ${index * 100}ms`,
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default TopProductsCard;