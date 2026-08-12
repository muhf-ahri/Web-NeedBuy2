// src/hooks/useWishlist.ts
import { useState, useCallback } from 'react';
import { useWishlistContext } from '../contexts/WishlistContext';

/**
 * Status wishlist (saved-products) untuk satu produk + handler toggle.
 * Data diambil sekali via WishlistContext, jadi aman dipakai banyak kartu
 * produk sekaligus tanpa membanjiri rate limiter.
 */
export const useWishlist = (productId: string | undefined) => {
  const { savedIds, toggle } = useWishlistContext();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saved = !!productId && savedIds.has(productId);

  const handleToggle = useCallback(async () => {
    if (!productId || busy) return;
    setBusy(true);
    setError(null);
    try {
      await toggle(productId);
    } catch (err: any) {
      setError(err.message ?? 'Gagal update wishlist, coba lagi ya');
    } finally {
      setBusy(false);
    }
  }, [productId, busy, toggle]);

  return { saved, busy, error, toggle: handleToggle };
};
