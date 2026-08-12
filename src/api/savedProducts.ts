import apiClient from './client';
import type { ApiResponse, PaginatedResponse } from '../types';

// ─── Types ─────────────────────────────────────────────────────────────────────
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

// ─── Saved Products Endpoints ─────────────────────────────────────────────────

/** GET /saved-products - List user's saved products */
export const getSavedProducts = async (params?: {
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<SavedProduct>> => {
  const res = await apiClient.get<ApiResponse<PaginatedResponse<SavedProduct>>>('/saved-products', { params });
  return { data: res.data.data as unknown as SavedProduct[], meta: (res.data as any).meta };
};

/** POST /saved-products - Save a product */
export const saveProduct = (productId: string) =>
  apiClient.post<ApiResponse<{ id: string; productId: string; createdAt: string }>>(
    '/saved-products',
    { productId }
  );

/** DELETE /saved-products/:productId - Remove a saved product */
export const unsaveProduct = (productId: string) =>
  apiClient.delete<ApiResponse<{ deleted: boolean }>>(`/saved-products/${productId}`);
