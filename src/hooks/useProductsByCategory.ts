// src/hooks/useProductsByCategory.ts
import { useEffect, useState, useCallback } from 'react';
import { getProductsByCategory, type GetProductsParams } from '../api/products';
import type { Product, PaginatedResponse } from '../types';

export const useProductsByCategory = (categorySlug: string | undefined, params?: Omit<GetProductsParams, 'categorySlug'>) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<Product>['meta'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string>('');

  const fetchProducts = useCallback(async () => {
    if (!categorySlug) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, meta } = await getProductsByCategory(categorySlug, params);
      setProducts(Array.isArray(data) ? data : []);
      setPagination(meta);

      // Extract category name from first product if available
      if (data && data.length > 0) {
        setCategoryName(data[0].category.name);
      }
    } catch (err: any) {
      console.error('[useProductsByCategory]', err);
      setError(err.message ?? 'Gagal memuat produk kategori');
    } finally {
      setLoading(false);
    }
  }, [categorySlug, params]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { 
    products, 
    pagination, 
    categoryName,
    loading, 
    error, 
    refetch: fetchProducts,
    hasMore: pagination ? pagination.page < pagination.totalPages : false,
    loadMore: async () => {
      if (!pagination || !categorySlug || !params) return;
      
      const nextPage = pagination.page + 1;
      if (nextPage > pagination.totalPages) return;
      
      try {
        const { data, meta } = await getProductsByCategory(categorySlug, {
          ...params,
          page: nextPage
        });
        setProducts(prev => [...prev, ...(Array.isArray(data) ? data : [])]);
        setPagination(meta);
      } catch (err: any) {
        console.error('[useProductsByCategory.loadMore]', err);
        throw err;
      }
    }
  };
};