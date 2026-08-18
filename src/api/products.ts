import apiClient from './client';
import type { ApiResponse, Product, PaginatedResponse, ProductDetail } from '../types';

export interface GetProductsParams {
  page?: number;
  limit?: number;

  q?: string;

  categorySlugs?: string;

  conditions?: string;

  sellerId?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'sold';
  onSale?: boolean;
}

export const getProducts = async (params?: GetProductsParams): Promise<PaginatedResponse<Product>> => {
  const res = await apiClient.get<ApiResponse<PaginatedResponse<Product>>>('/products', { params });

  const data = Array.isArray(res.data?.data) ? (res.data.data as unknown as Product[]) : [];
  return { data, meta: (res.data as any)?.meta };
};

export const getProductBySlug = async (slug: string): Promise<ProductDetail> => {
  const res = await apiClient.get<ApiResponse<ProductDetail>>(`/products/${slug}`);
  return res.data?.data;
};

export const getProductsByCategory = async (
  categorySlug: string,
  params?: Omit<GetProductsParams, 'categorySlug'>
): Promise<PaginatedResponse<Product>> => {
  const res = await apiClient.get<ApiResponse<PaginatedResponse<Product>>>(`/products/category/${categorySlug}`, { params });
  const data = Array.isArray(res.data?.data) ? (res.data.data as unknown as Product[]) : [];
  return { data, meta: (res.data as any)?.meta };
};

export const recordProductView = (id: string) =>
  apiClient.post<ApiResponse<{ recorded: boolean }>>(`/products/${id}/view`);
