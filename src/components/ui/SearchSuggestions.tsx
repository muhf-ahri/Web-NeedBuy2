import React from 'react';
import { useNavigate } from 'react-router-dom';

import Icon from './Icon';
import { formatRupiah } from '../../utils/currency';
import { useSearchSuggestions } from '../../hooks/useSearchSuggestions';
import type { Seller } from '../../api/sellers';

interface SearchSuggestionsProps {
  term: string;
  onPick?: () => void;
  className?: string;
}

const placeholderImage =
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80';

const StoreAvatar: React.FC<{ store: Seller }> = ({ store }) => (
  <span
    className="
      flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden
      rounded-lg border border-[#e0e3e5] bg-[#F5F7FB]
    "
  >
    {store.logoUrl ? (
      <img src={store.logoUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
    ) : (
      <span className="text-[16px] font-bold text-[#4077a6]">
        {store.storeName.charAt(0).toUpperCase()}
      </span>
    )}
  </span>
);

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  term,
  onPick,
  className = '',
}) => {
  const navigate = useNavigate();
  const { products, stores, loading } = useSearchSuggestions(term);
  const query = term.trim();
  const isEmpty = products.length === 0 && stores.length === 0;

  if (query.length < 2) return null;

  const go = (to: string) => {
    onPick?.();
    navigate(to);
  };

  return (
    <div
      className={`
        absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden
        rounded-2xl border border-[#e0e3e5] bg-white
        shadow-[0_18px_50px_rgba(32,36,45,0.15)] ${className}
      `}
    >
      {loading && isEmpty ? (
        <div className="space-y-3 p-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex animate-pulse items-center gap-3">
              <div className="h-11 w-11 shrink-0 rounded-lg bg-[#F5F7FB]" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-3/4 rounded-full bg-[#F5F7FB]" />
                <div className="h-3 w-1/3 rounded-full bg-[#F5F7FB]" />
              </div>
            </div>
          ))}
        </div>
      ) : isEmpty ? (
        <p className="px-4 py-3 text-[13px] text-[#737686]">
          Tidak ada produk atau toko untuk "{query}".
        </p>
      ) : (
        <ul className="max-h-[60vh] overflow-y-auto">
          {stores.length > 0 && (
            <li
              className="
                px-3 pb-1 pt-2 text-[10px] font-bold uppercase
                tracking-[0.16em] text-[#737686]
              "
            >
              Toko
            </li>
          )}

          {stores.map((store) => (
            <li key={store.id}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => go(`/search?seller=${store.id}`)}
                className="
                  flex w-full items-center gap-3 px-3 py-2.5 text-left
                  transition-colors hover:bg-[#F5F7FB]
                "
              >
                <StoreAvatar store={store} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="truncate text-[13px] font-medium text-[#101319]">
                      {store.storeName}
                    </span>
                    {store.vacationMode && (
                      <span
                        className="
                          shrink-0 rounded-full bg-[#FFF7E0] px-1.5 py-0.5
                          text-[10px] font-semibold text-[#B45309]
                        "
                      >
                        Libur
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block truncate text-[11px] text-[#737686]">
                    {store.description || `${store._count?.products ?? 0} produk`}
                  </span>
                </span>
                <Icon name="shop" size={14} className="shrink-0 text-[#A2A8B3]" />
              </button>
            </li>
          ))}

          {stores.length > 0 && products.length > 0 && (
            <li
              className="
                mt-1 border-t border-[#e0e3e5] px-3 pb-1 pt-2 text-[10px]
                font-bold uppercase tracking-[0.16em] text-[#737686]
              "
            >
              Produk
            </li>
          )}

          {products.map((product) => {
            const image =
              product.images.find((img) => img.isPrimary)?.url ||
              product.images[0]?.url ||
              placeholderImage;

            return (
              <li key={product.id}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => go(`/products/${product.slug}`)}
                  className="
                    flex w-full items-center gap-3 px-3 py-2.5 text-left
                    transition-colors hover:bg-[#F5F7FB]
                  "
                >
                  <img
                    src={image}
                    alt=""
                    loading="lazy"
                    className="h-11 w-11 shrink-0 rounded-lg bg-[#F5F7FB] object-cover"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium text-[#101319]">
                      {product.name}
                    </span>
                    <span className="mt-0.5 flex items-center gap-2">
                      <span className="text-[13px] font-bold text-[#4077a6]">
                        {formatRupiah(product.price)}
                      </span>
                      <span className="inline-flex items-center gap-0.5 text-[11px] text-[#737686]">
                        <Icon name="star" size={11} className="text-[#FFD500]" />
                        {Number(product.rating).toFixed(1)}
                      </span>
                      {product.discountPercent > 0 && (
                        <span
                          className="
                            rounded-full bg-[#FFF0F0] px-1.5 py-0.5
                            text-[10px] font-bold text-[#ba1a1a]
                          "
                        >
                          -{product.discountPercent}%
                        </span>
                      )}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => go(`/search?q=${encodeURIComponent(query)}`)}
        className="
          flex w-full items-center justify-between gap-2 border-t
          border-[#e0e3e5] px-4 py-2.5 text-[12px] font-semibold
          text-[#4077a6] transition-colors hover:bg-[#F5F7FB]
        "
      >
        Lihat semua hasil untuk "{query}"
        <Icon name="arrowRight" size={14} />
      </button>
    </div>
  );
};

export default SearchSuggestions;