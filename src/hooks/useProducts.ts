// src/hooks/useProducts.ts
import { useEffect, useState, useCallback } from 'react';
import { getProducts, type GetProductsParams } from '../api/products';
import type { Product, PaginatedResponse } from '../types';

export const useProducts = (params?: GetProductsParams) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<Product>['meta'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, meta } = await getProducts(params);
      console.log('[useProducts] Data fetched:', data);
      setProducts(Array.isArray(data) ? data : []);
      setPagination(meta);
    } catch (err: any) {
      console.error('[useProducts] Error:', err);
      setError(err.message ?? 'Gagal muat produk, coba lagi ya');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    pagination,
    total: pagination?.total ?? 0,
    totalPages: pagination?.totalPages ?? 0,
    page: pagination?.page ?? 1,
    loading,
    error,
    refetch: fetchProducts,
    hasMore: pagination ? pagination.page < pagination.totalPages : false,
    loadMore: async () => {
      if (!pagination || !params) return;
      
      const nextPage = pagination.page + 1;
      if (nextPage > pagination.totalPages) return;
      
      try {
        const { data, meta } = await getProducts({ ...params, page: nextPage });
        setProducts(prev => [...prev, ...(Array.isArray(data) ? data : [])]);
        setPagination(meta);
      } catch (err: any) {
        console.error('[useProducts.loadMore]', err);
        throw err;
      }
    }
  };
};