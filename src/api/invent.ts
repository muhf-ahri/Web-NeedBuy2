// src/api/invent.ts
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
  /** Prisma Decimal diserialisasi sebagai string — selalu lewat Number() dulu. */
  price: string;
  stock: number;
  isActive: boolean;
  rating: string;
  soldCount: number;
  createdAt: string;
  updatedAt: string;
  category: { id: string; name: string; slug: string } | null;
  images: { url: string }[];
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
}

export type UpdateInventPayload = Partial<CreateInventPayload>;

export interface ListInventParams {
  q?: string;
  categoryId?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'ALL';
  page?: number;
  limit?: number;
}

/** GET /invent — daftar produk toko sendiri (terpaginasi, cek kepemilikan di server) */
export const listInvent = async (
  params?: ListInventParams
): Promise<{ items: InventProduct[]; meta: InventMeta }> => {
  const res = await apiClient.get<ApiResponse<InventProduct[]> & { meta: InventMeta }>('/invent', {
    params,
  });
  return { items: res.data.data, meta: res.data.meta };
};

/** GET /invent/stats — hitungan kartu Active / Out of Stock / Drafts */
export const getInventStats = () =>
  apiClient.get<ApiResponse<InventStats>>('/invent/stats');

/** GET /invent/:id */
export const getInvent = (id: string) =>
  apiClient.get<ApiResponse<InventProduct>>(`/invent/${id}`);

/** POST /invent */
export const createInvent = (payload: CreateInventPayload) =>
  apiClient.post<ApiResponse<InventProduct>>('/invent', payload);

/** PATCH /invent/:id */
export const updateInvent = (id: string, payload: UpdateInventPayload) =>
  apiClient.patch<ApiResponse<InventProduct>>(`/invent/${id}`, payload);

/** DELETE /invent/:id */
export const deleteInvent = (id: string) =>
  apiClient.delete<ApiResponse<{ deleted: boolean; id: string }>>(`/invent/${id}`);

export type ProductStatus = 'Active' | 'Out of Stock' | 'Draft';

/**
 * Status yang ditampilkan di tabel diturunkan dari `isActive` + `stock`, sama
 * persis dengan definisi yang dipakai `/invent/stats` di server. Ditaruh di
 * satu tempat supaya label baris dan angka kartu tidak bisa saling berbeda.
 */
export function productStatus(product: InventProduct): ProductStatus {
  if (!product.isActive) return 'Draft';
  return product.stock === 0 ? 'Out of Stock' : 'Active';
}

/**
 * POST /invent/:id/images — upload satu atau lebih gambar untuk produk.
 * FormData harus berisi field 'images' (array file).
 */
export const uploadInventImages = (id: string, formData: FormData) =>
  apiClient.post<ApiResponse<{ images: { url: string }[] }>>(
    `/invent/${id}/images`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );