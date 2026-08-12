// src/contexts/WishlistContext.tsx
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import {
  getSavedProducts,
  saveProduct,
  unsaveProduct,
  type SavedProduct,
} from '../api/savedProducts';

interface WishlistContextType {
  items: SavedProduct[];
  savedIds: Set<string>;
  loading: boolean;
  refresh: () => Promise<void>;
  toggle: (productId: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

/**
 * Daftar wishlist user. Fetch dilakukan SATU KALI per aplikasi (bukan per
 * kartu produk) supaya tidak meledakkan rate limiter. Setelah toggle, list
 * di-refresh ulang supaya selalu sinkron dengan backend.
 */
export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<SavedProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await getSavedProducts({ limit: 100 });
      setItems(res.data);
    } catch {
      // biarkan state lama; fetch ulang tidak wajib
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const savedIds = useMemo(() => new Set(items.map((i) => i.product.id)), [items]);

  const toggle = useCallback(
    async (productId: string) => {
      const wasSaved = savedIds.has(productId);
      if (wasSaved) await unsaveProduct(productId);
      else await saveProduct(productId);
      await refresh();
    },
    [savedIds, refresh]
  );

  return (
    <WishlistContext.Provider value={{ items, savedIds, loading, refresh, toggle }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlistContext = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlistContext must be used within WishlistProvider');
  return ctx;
};
