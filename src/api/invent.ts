import apiClient from './client';
import type { ApiResponse } from '../types';

export interface InventProduct {
  id: string;
  sellerId: string;
  categoryId: string;
  sku: string | null;
  name: string;
  slug: string;
  description: string | null;

  price: string;
  stock: number;
  isActive: boolean;
  rating: string;
  soldCount: number;
  createdAt: string;
  updatedAt: string;
  discountPercent: number;

  bulkMinQty: number | null;
  bulkDiscountPercent: number | null;
  category: { id: string; name: string; slug: string } | null;

  images: { id?: string; url: string; isPrimary?: boolean; sortOrder?: number }[];
  attributes?: { id: string; attrKey: string; attrValue: string }[];
}

export interface InventStats {
  total: number;
  active: number;
  outOfStock: number;
  drafts: number;
}

export interface InventMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CreateInventPayload {
  name: string;
  sku?: string;
  description?: string;
  categoryId: string;
  price: number;
  stock: number;
  isActive?: boolean;
  discountPercent?: number;

  bulkMinQty?: number | null;
  bulkDiscountPercent?: number | null;

  images?: { url: string; isPrimary?: boolean; sortOrder?: number }[];

  attributes?: { attrKey: string; attrValue: string }[];
}

export type UpdateInventPayload = Partial<CreateInventPayload>;

export interface ListInventParams {
  q?: string;
  categoryId?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'ALL';
  page?: number;
  limit?: number;

  sortBy?: 'name' | 'price' | 'stock' | 'createdAt';
  order?: 'asc' | 'desc';
}

export const listInvent = async (
  params?: ListInventParams
): Promise<{ items: InventProduct[]; meta: InventMeta }> => {
  const res = await apiClient.get<ApiResponse<InventProduct[]> & { meta: InventMeta }>('/invent', {
    params,
  });
  return { items: res.data.data, meta: res.data.meta };
};

export const getInventStats = () =>
  apiClient.get<ApiResponse<InventStats>>('/invent/stats');

export const getInvent = (id: string) =>
  apiClient.get<ApiResponse<InventProduct>>(`/invent/${id}`);

export const createInvent = (payload: CreateInventPayload) =>
  apiClient.post<ApiResponse<InventProduct>>('/invent', payload);

export const updateInvent = (id: string, payload: UpdateInventPayload) =>
  apiClient.patch<ApiResponse<InventProduct>>(`/invent/${id}`, payload);

export const deleteInvent = (id: string) =>
  apiClient.delete<ApiResponse<{ deleted: boolean; id: string }>>(`/invent/${id}`);

export type ProductStatus = 'Tayang' | 'Stok Habis' | 'Draf';

export function productStatus(product: InventProduct): ProductStatus {
  if (!product.isActive) return 'Draf';
  return product.stock === 0 ? 'Stok Habis' : 'Tayang';
}
