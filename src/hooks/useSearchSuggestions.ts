// src/hooks/useSearchSuggestions.ts
import { useEffect, useState } from 'react';
import { getProducts } from '../api/products';
import { searchSellers, type Seller } from '../api/sellers';
import type { Product } from '../types';

const DEBOUNCE_MS = 250;
const MIN_CHARS = 2;
const PRODUCT_LIMIT = 6;
const STORE_LIMIT = 3;

/**
 * Saran saat mengetik di kolom pencarian: produk DAN toko.
 *
 * Toko harus diminta terpisah karena `GET /products?q=` hanya mencocokkan nama
 * dan deskripsi produk — nama toko tidak akan pernah ketemu dari sana.
 *
 * Debounce 250ms supaya tiap ketikan tidak jadi satu request, dan hasil request
 * lama diabaikan lewat flag `stale`: tanpa itu respons yang datang terlambat
 * bisa menimpa hasil ketikan terbaru.
 */
export function useSearchSuggestions(term: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const query = term.trim();
    if (query.length < MIN_CHARS) {
      setProducts([]);
      setStores([]);
      setLoading(false);
      return;
    }

    let stale = false;
    setLoading(true);
    const timer = setTimeout(async () => {
      // allSettled, bukan all: satu sisi yang gagal tidak boleh mengosongkan
      // sisi yang berhasil.
      const [productRes, storeRes] = await Promise.allSettled([
        getProducts({ q: query, limit: PRODUCT_LIMIT }),
        searchSellers(query, STORE_LIMIT),
      ]);
      if (stale) return;

      setProducts(productRes.status === 'fulfilled' ? productRes.value.data : []);
      setStores(storeRes.status === 'fulfilled' ? storeRes.value.items : []);
      setLoading(false);
    }, DEBOUNCE_MS);

    return () => {
      stale = true;
      clearTimeout(timer);
    };
  }, [term]);

  return { products, stores, loading };
}
