// src/hooks/useCategories.ts
import { useEffect, useState, useCallback } from 'react';
import { getCategories } from '../api/categories';
import type { Category } from '../types';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCategories();
      console.log('[useCategories] Data fetched:', data);
      setCategories(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('[useCategories] Error:', err);
      setError(err.message ?? 'Gagal memuat kategori');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories };
};
