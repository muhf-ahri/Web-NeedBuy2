import apiClient from './client';
import type { ApiResponse, PaginatedResponse } from '../types';

export interface SavedProduct {
  id: string;
  createdAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: string;
    stock: number;
    rating: string;
    isActive: boolean;
    images: Array<{ url: string }>;
  };
}

export const getSavedProducts = async (params?: {
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<SavedProduct>> => {
  const res = await apiClient.get<ApiResponse<PaginatedResponse<SavedProduct>>>('/saved-products', { params });
  return { data: res.data.data as unknown as SavedProduct[], meta: (res.data as any).meta };
};

export const saveProduct = (productId: string) =>
  apiClient.post<ApiResponse<{ id: string; productId: string; createdAt: string }>>(
    '/saved-products',
    { productId }
  );

export const unsaveProduct = (productId: string) =>
  apiClient.delete<ApiResponse<{ deleted: boolean }>>(`/saved-products/${productId}`);
