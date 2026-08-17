import { useEffect, useState, useCallback } from 'react';
import { getCategoryBySlug } from '../api/categories';
import type { Category } from '../types';

export const useCategoryDetail = (slug: string) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const fetchCategory = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    setNotFound(false);
    try {
      const data = await getCategoryBySlug(slug);
      setCategory(data);
    } catch (err: any) {
      const msg: string = err.message ?? '';
      if (msg.includes('RESOURCE_NOT_FOUND') || msg.includes('tidak ditemukan') || msg.includes('404')) {
        setNotFound(true);
      } else {
        setError(msg || 'Gagal memuat kategori');
      }
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  return { category, loading, error, notFound, refetch: fetchCategory };
};
