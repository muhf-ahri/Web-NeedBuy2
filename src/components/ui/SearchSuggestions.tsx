// src/components/ui/SearchSuggestions.tsx
//
// Panel saran di bawah kolom pencarian: toko dan produk. Dipakai Navbar,
// halaman Search, dan hero home — satu tampilan untuk ketiganya, jadi
// perubahan di sini berlaku untuk ketiga kolom pencarian sekaligus.
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon';
import { formatRupiah } from '../../utils/currency';
import { useSearchSuggestions } from '../../hooks/useSearchSuggestions';
import type { Seller } from '../../api/sellers';

interface SearchSuggestionsProps {
  term: string;
  /** Dipanggil setelah user memilih saran atau menekan "lihat semua hasil". */
  onPick?: () => void;
  className?: string;
}

const placeholderImage =
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80';

/** Logo toko, dengan inisial nama sebagai cadangan kalau logonya belum ada. */
const StoreAvatar: React.FC<{ store: Seller }> = ({ store }) => (
  <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#e0e3e5] bg-[#dbe1ff]">
    {store.logoUrl ? (
      <img src={store.logoUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
    ) : (
      <span className="text-[16px] font-bold text-[#004ac6]">
        {store.storeName.charAt(0).toUpperCase()}
      </span>
    )}
  </span>
);

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ term, onPick, className = '' }) => {
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
      className={`absolute left-0 right-0 top-full mt-2 z-50 overflow-hidden rounded-2xl border border-[#e0e3e5] bg-white shadow-lg ${className}`}
    >
      {loading && isEmpty ? (
        <div className="p-3 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-11 h-11 rounded-lg bg-[#f2f4f6] shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-3/4 rounded-full bg-[#f2f4f6]" />
                <div className="h-3 w-1/3 rounded-full bg-[#f2f4f6]" />
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
          {/* Toko lebih dulu: kalau yang diketik memang nama toko, itulah yang
              dicari user — jangan sampai tenggelam di bawah daftar produk. */}
          {stores.length > 0 && (
            <li className="px-3 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wide text-[#737686]">
              Toko
            </li>
          )}
          {stores.map((store) => (
            <li key={store.id}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => go(`/search?seller=${store.id}`)}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-[#f2f4f6] transition-colors"
              >
                <StoreAvatar store={store} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="truncate text-[13px] font-medium text-[#101319]">
                      {store.storeName}
                    </span>
                    {store.vacationMode && (
                      <span className="shrink-0 rounded-full bg-[#fff4e0] px-1.5 py-0.5 text-[10px] font-semibold text-[#b45309]">
                        Libur
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block truncate text-[11px] text-[#737686]">
                    {store.description || `${store._count?.products ?? 0} produk`}
                  </span>
                </span>
                <Icon name="shop" size={14} className="shrink-0 text-[#c3c6d7]" />
              </button>
            </li>
          ))}

          {stores.length > 0 && products.length > 0 && (
            <li className="mt-1 border-t border-[#e0e3e5] px-3 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wide text-[#737686]">
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
                  onMouseDown={(e) => e.preventDefault()} // jangan blur input sebelum klik terproses
                  onClick={() => go(`/products/${product.slug}`)}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-[#f2f4f6] transition-colors"
                >
                  <img
                    src={image}
                    alt=""
                    loading="lazy"
                    className="w-11 h-11 rounded-lg object-cover bg-[#f2f4f6] shrink-0"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-medium text-[#101319] truncate">
                      {product.name}
                    </span>
                    <span className="mt-0.5 flex items-center gap-2">
                      <span className="text-[13px] font-bold text-[#004ac6]">
                        {formatRupiah(product.price)}
                      </span>
                      <span className="inline-flex items-center gap-0.5 text-[11px] text-[#737686]">
                        <Icon name="star" size={11} className="text-[#ffb020]" />
                        {Number(product.rating).toFixed(1)}
                      </span>
                      {product.discountPercent > 0 && (
                        <span className="rounded-full bg-[#fff0e9] px-1.5 py-0.5 text-[10px] font-bold text-[#ff5a1f]">
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
        className="flex w-full items-center justify-between gap-2 border-t border-[#e0e3e5] px-4 py-2.5 text-[12px] font-semibold text-[#004ac6] hover:bg-[#f2f4f6] transition-colors"
      >
        Lihat semua hasil untuk "{query}"
        <Icon name="arrowRight" size={14} />
      </button>
    </div>
  );
};

export default SearchSuggestions;
