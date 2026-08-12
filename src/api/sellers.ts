import apiClient from './client';
import type { ApiResponse } from '../types';

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface Seller {
  id: string;
  storeName: string;
  description: string | null;
  logoUrl: string | null;
  /** Alamat toko — publik, bagian dari profil toko. */
  address: string | null;
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
  phone: string | null;
  updatedAt: string;
}

/**
 * Pendaftaran toko. `storeName` (nama perusahaan), `address`, dan `phone`
 * wajib — di sinilah data toko dikumpulkan sejak pilihan role dihapus dari
 * form register. `logoUrl` diisi URL hasil `uploadImage()`.
 */
export interface CreateSellerPayload {
  storeName: string;
  address: string;
  phone: string;
  description?: string;
  logoUrl?: string;
  businessEmail?: string;
}

export interface UpdateSellerPayload {
  storeName?: string;
  description?: string | null;
  address?: string | null;
  phone?: string | null;
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

/** POST /sellers - Daftarkan toko sendiri (buyer -> seller), dari halaman profil */
export const createSellerStore = (payload: CreateSellerPayload) =>
  apiClient.post<ApiResponse<OwnSeller>>('/sellers', payload);

/** GET /sellers/me - Setelan toko sendiri (sumber data halaman Seller Settings) */
export const getOwnSeller = () => apiClient.get<ApiResponse<OwnSeller>>('/sellers/me');

/** PATCH /sellers/me - Ubah setelan toko sendiri */
export const updateSellerStore = (payload: UpdateSellerPayload) =>
  apiClient.patch<ApiResponse<OwnSeller>>('/sellers/me', payload);

/** Status ikut toko, bentuk yang sama dibalikkan follow maupun unfollow. */
export interface FollowState {
  sellerId: string;
  following: boolean;
  followerCount: number;
}

/**
 * POST/DELETE /sellers/:id/follow — ikuti atau berhenti ikuti toko.
 *
 * Keduanya idempoten di server (unique user+seller), jadi tombolnya tidak perlu
 * menjaga dirinya dari klik ganda demi kebenaran data — hanya demi rasa.
 */
export const followSeller = (sellerId: string) =>
  apiClient.post<ApiResponse<FollowState>>(`/sellers/${sellerId}/follow`);

export const unfollowSeller = (sellerId: string) =>
  apiClient.delete<ApiResponse<FollowState>>(`/sellers/${sellerId}/follow`);
