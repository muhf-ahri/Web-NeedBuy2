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
  discountPercent: number;
  /** Grosir: keduanya null = tidak ada penawaran. */
  bulkMinQty: number | null;
  bulkDiscountPercent: number | null;
  category: { id: string; name: string; slug: string } | null;
  /** Galeri lengkap — form edit butuh semuanya, bukan cuma thumbnail. */
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
  /** Grosir: keduanya diisi, atau keduanya null. Server menolak yang setengah. */
  bulkMinQty?: number | null;
  bulkDiscountPercent?: number | null;
  /**
   * URL hasil `uploadImage()`, BUKAN berkas. Gambar tersimpan bareng produknya
   * dalam satu transaction — form ini dulu mengirim multipart ke
   * `/invent/:id/images` yang handler-nya tidak pernah ada di server, dan itu
   * sebabnya produk penjual tampil tanpa gambar di halaman pembeli.
   */
  images?: { url: string; isPrimary?: boolean; sortOrder?: number }[];
  /** Spesifikasi. Beberapa baris dengan attrKey sama = pilihan model/varian. */
  attributes?: { attrKey: string; attrValue: string }[];
}

export type UpdateInventPayload = Partial<CreateInventPayload>;

export interface ListInventParams {
  q?: string;
  categoryId?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'ALL';
  page?: number;
  limit?: number;
  /** Diurut di server: tabelnya terpaginasi, jadi mengurut per halaman salah. */
  sortBy?: 'name' | 'price' | 'stock' | 'createdAt';
  order?: 'asc' | 'desc';
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

export type ProductStatus = 'Tayang' | 'Stok Habis' | 'Draf';

/**
 * Status yang ditampilkan di tabel diturunkan dari `isActive` + `stock`, sama
 * persis dengan definisi yang dipakai `/invent/stats` di server. Ditaruh di
 * satu tempat supaya label baris dan angka kartu tidak bisa saling berbeda.
 */
export function productStatus(product: InventProduct): ProductStatus {
  if (!product.isActive) return 'Draf';
  return product.stock === 0 ? 'Stok Habis' : 'Tayang';
}
