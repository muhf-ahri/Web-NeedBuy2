import apiClient from './client';
import type { ApiResponse } from '../types';

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface Seller {
  id: string;
  storeName: string;
  description: string | null;
  logoUrl: string | null;
  /** Libur yang diatur penjual sendiri — berbeda dari `status` yang dikelola admin. */
  vacationMode: boolean;
  rating: string;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
  _count?: {
    products: number;
  };
}

/** Tampilan pemilik toko: ikut membawa email bisnis yang tidak dibuka ke publik. */
export interface OwnSeller extends Seller {
  businessEmail: string | null;
  updatedAt: string;
}

export interface UpdateSellerPayload {
  storeName?: string;
  description?: string | null;
  logoUrl?: string | null;
  businessEmail?: string | null;
  vacationMode?: boolean;
}

// ─── Seller Endpoints ──────────────────────────────────────────────────────────

export interface SellersMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * GET /sellers?q= — cari toko berdasarkan nama atau deskripsi.
 *
 * Terpisah dari pencarian produk: `GET /products?q=` hanya mencocokkan nama
 * dan deskripsi PRODUK, jadi nama toko tidak akan pernah ketemu dari sana.
 */
export const searchSellers = async (
  q: string,
  limit = 6
): Promise<{ items: Seller[]; meta: SellersMeta }> => {
  const res = await apiClient.get<ApiResponse<Seller[]> & { meta: SellersMeta }>('/sellers', {
    params: { q, limit },
  });
  return { items: res.data.data, meta: res.data.meta };
};

/** GET /sellers/:id - Get public seller profile */
export const getSeller = (id: string) =>
  apiClient.get<ApiResponse<Seller>>(`/sellers/${id}`);

/** POST /sellers - Register own store (buyer -> seller) */
export const createSellerStore = (storeName: string) =>
  apiClient.post<ApiResponse<Seller>>('/sellers', { storeName });

/** GET /sellers/me - Setelan toko sendiri (sumber data halaman Seller Settings) */
export const getOwnSeller = () => apiClient.get<ApiResponse<OwnSeller>>('/sellers/me');

/** PATCH /sellers/me - Ubah setelan toko sendiri */
export const updateSellerStore = (payload: UpdateSellerPayload) =>
  apiClient.patch<ApiResponse<OwnSeller>>('/sellers/me', payload);
