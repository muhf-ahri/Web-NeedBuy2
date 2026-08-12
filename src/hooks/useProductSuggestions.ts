// src/hooks/useProductSuggestions.ts
import { useEffect, useState } from 'react';
import { getProducts } from '../api/products';
import type { Product } from '../types';

const DEBOUNCE_MS = 250;
const MIN_CHARS = 2;
const LIMIT = 6;

/**
 * Saran produk saat mengetik. Debounce 250ms supaya tiap ketikan tidak jadi
 * satu request, dan hasil request lama diabaikan lewat flag `stale` — tanpa itu
 * respons yang datang terlambat bisa menimpa hasil ketikan terbaru.
 */
export function useProductSuggestions(term: string) {
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const query = term.trim();
    if (query.length < MIN_CHARS) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    let stale = false;
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await getProducts({ q: query, limit: LIMIT });
        if (!stale) setSuggestions(res.data);
      } catch {
        if (!stale) setSuggestions([]);
      } finally {
        if (!stale) setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      stale = true;
      clearTimeout(timer);
    };
  }, [term]);

  return { suggestions, loading };
}
