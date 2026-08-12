// src/components/ui/SearchSuggestions.tsx
//
// Panel saran di bawah kolom pencarian: gambar, nama, harga, rating. Dipakai
// Navbar, halaman Search, dan hero home — satu tampilan untuk ketiganya.
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon';
import { formatRupiah } from '../../utils/currency';
import { useProductSuggestions } from '../../hooks/useProductSuggestions';

interface SearchSuggestionsProps {
  term: string;
  /** Dipanggil setelah user memilih saran atau menekan "lihat semua hasil". */
  onPick?: () => void;
  className?: string;
}

const placeholderImage =
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80';

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ term, onPick, className = '' }) => {
  const navigate = useNavigate();
  const { suggestions, loading } = useProductSuggestions(term);
  const query = term.trim();

  if (query.length < 2) return null;

  const go = (to: string) => {
    onPick?.();
    navigate(to);
  };

  return (
    <div
      className={`absolute left-0 right-0 top-full mt-2 z-50 overflow-hidden rounded-2xl border border-[#e0e3e5] bg-white shadow-lg ${className}`}
    >
      {loading && suggestions.length === 0 ? (
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
      ) : suggestions.length === 0 ? (
        <p className="px-4 py-3 text-[13px] text-[#737686]">
          Tidak ada produk untuk "{query}".
        </p>
      ) : (
        <ul className="max-h-[60vh] overflow-y-auto">
          {suggestions.map((product) => {
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
